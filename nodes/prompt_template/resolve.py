"""Decide which template content a node executes with (library vs snapshot).

Order (see CLAUDE.md "保存と再現性"):
  pin_snapshot ON           -> snapshot (error if there is none)
  id found in library       -> library (warn if the snapshot differs)
  id missing / lib broken   -> snapshot of the same id (warn)
  nothing usable            -> error
"""

import hashlib
import json
from dataclasses import dataclass, field

from ...core.errors import InvalidData, NotFound, StorageCorrupt
from .schema import validate_template

CONTENT_FIELDS = ("template", "negative_prompt", "variables")


@dataclass
class Resolution:
    template: dict
    source: str  # "library" | "snapshot"
    warnings: list = field(default_factory=list)


def _warning(code, message):
    return {"code": code, "message": message}


def content_hash(template):
    """Hash of the fields that affect the output (name/category/metadata are ignored)."""
    content = {k: template.get(k) for k in CONTENT_FIELDS}
    raw = json.dumps(content, sort_keys=True, ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()[:16]


def parse_variables(raw):
    """Parse the node's `variables` widget (JSON object of str -> str). Empty means {}."""
    if not raw or not raw.strip():
        return {}
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise InvalidData("'variables' is not valid JSON", code="INVALID_VARIABLES") from e
    if not isinstance(data, dict) or not all(isinstance(v, str) for v in data.values()):
        raise InvalidData("'variables' must be a JSON object of strings", code="INVALID_VARIABLES")
    return data


def parse_snapshot(raw):
    """Parse the node's `snapshot` widget. Empty means no snapshot (None)."""
    if not raw or not raw.strip():
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise InvalidData("'snapshot' is not valid JSON", code="INVALID_SNAPSHOT") from e
    try:
        return validate_template(data)
    except InvalidData as e:
        raise InvalidData(f"'snapshot' is not a valid template: {e.message}", code="INVALID_SNAPSHOT") from e


def resolve_template(lookup, template_id, snapshot, pin_snapshot):
    """
    lookup:   callable(template_id) -> template dict or None (may raise StorageCorrupt)
    snapshot: parsed snapshot dict or None
    """
    if pin_snapshot:
        if snapshot is None:
            raise InvalidData("pin_snapshot is on but the node has no snapshot", code="SNAPSHOT_MISSING")
        return Resolution(snapshot, "snapshot")

    if not template_id:
        raise InvalidData("No template selected", code="NO_TEMPLATE")

    usable_snapshot = snapshot if snapshot is not None and snapshot["id"] == template_id else None

    try:
        template = lookup(template_id)
    except StorageCorrupt as e:
        if usable_snapshot is None:
            raise
        return Resolution(
            usable_snapshot,
            "snapshot",
            [_warning("library_unavailable", f"Template library is unavailable, using snapshot: {e.message}")],
        )

    if template is not None:
        warnings = []
        if snapshot is not None and content_hash(snapshot) != content_hash(template):
            warnings.append(_warning("snapshot_outdated", "Template has changed since the snapshot was taken"))
        return Resolution(template, "library", warnings)

    if usable_snapshot is not None:
        return Resolution(
            usable_snapshot,
            "snapshot",
            [_warning("template_missing", f"Template '{template_id}' is not in the library, using snapshot")],
        )

    raise NotFound(f"Template '{template_id}' not found and no snapshot is available", details={"id": template_id})
