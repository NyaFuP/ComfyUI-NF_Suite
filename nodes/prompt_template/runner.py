"""What the Prompt Template node does, as plain functions (no ComfyUI imports).

All functions take the raw widget values:
    template_id: str, variables_raw: str (JSON), snapshot_raw: str (JSON or ""), pin_snapshot: bool
and, for run(), `inputs`: {link input name: text} for the connected input1 / input2.
and `lookup`: callable(template_id) -> template dict or None.
"""

import hashlib
import json

from ...core.errors import NFError
from .expand import expand_template
from .resolve import content_hash, parse_snapshot, parse_variables, resolve_template


def _resolve(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot):
    variables = parse_variables(variables_raw)
    snapshot = parse_snapshot(snapshot_raw)
    resolution = resolve_template(lookup, template_id, snapshot, pin_snapshot)
    return resolution, variables


def run(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot, inputs=None):
    """Return {"positive", "negative", "warnings", "source"}. Raises NFError when not runnable."""
    resolution, variables = _resolve(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot)
    expanded = expand_template(resolution.template, variables, inputs)
    return {
        "positive": expanded["positive"],
        "negative": expanded["negative"],
        "warnings": resolution.warnings + expanded["warnings"],
        "source": resolution.source,
    }


def validate(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot):
    """True when runnable, otherwise an error message (ComfyUI validate_inputs contract)."""
    try:
        _resolve(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot)
    except NFError as e:
        return f"[{e.code}] {e.message}"
    return True


def fingerprint(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot):
    """Cache key: changes whenever the output could change (including external library edits).

    The connected `text` is not part of it: ComfyUI passes only constants here, and a change
    upstream already changes the node's cache key.
    """
    try:
        resolution, variables = _resolve(lookup, template_id, variables_raw, snapshot_raw, pin_snapshot)
    except NFError as e:
        return f"unresolved:{e.code}"
    raw = json.dumps(
        {"content": content_hash(resolution.template), "variables": variables},
        sort_keys=True,
        ensure_ascii=False,
    ).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()
