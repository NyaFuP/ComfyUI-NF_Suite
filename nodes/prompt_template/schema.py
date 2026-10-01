"""Template library JSON schema: validation, defaults and id generation.

Library format (version 1):
    {"version": 1, "templates": [{"id", "name", "category", "template",
                                  "negative_prompt", "variables": {name: default}}]}
Unknown fields are preserved so that newer files survive a round trip.
"""

import re

from ...core.errors import InvalidData

LIBRARY_VERSION = 1

ID_RE = re.compile(r"^[a-z0-9_-]{1,100}$")
VARIABLE_NAME_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")

_OPTIONAL_STRING_FIELDS = ("category", "negative_prompt")


def _invalid_template(message, template_id=None):
    details = {"id": template_id} if template_id else None
    return InvalidData(message, code="INVALID_TEMPLATE", details=details)


def _invalid_library(message):
    return InvalidData(message, code="INVALID_LIBRARY")


def empty_library():
    return {"version": LIBRARY_VERSION, "templates": []}


def validate_template(data):
    """Return a normalized copy of `data`, or raise InvalidData(code=INVALID_TEMPLATE)."""
    if not isinstance(data, dict):
        raise _invalid_template("Template must be an object")

    tpl_id = data.get("id")
    if not isinstance(tpl_id, str) or not ID_RE.match(tpl_id):
        raise _invalid_template(
            "Field 'id' is required and must match [a-z0-9_-]{1,100}", tpl_id if isinstance(tpl_id, str) else None
        )

    name = data.get("name")
    if not isinstance(name, str) or not name.strip():
        raise _invalid_template("Field 'name' is required and must be a non-empty string", tpl_id)

    if not isinstance(data.get("template"), str):
        raise _invalid_template("Field 'template' is required and must be a string", tpl_id)

    result = dict(data)
    for field in _OPTIONAL_STRING_FIELDS:
        value = result.get(field, "")
        if not isinstance(value, str):
            raise _invalid_template(f"Field '{field}' must be a string", tpl_id)
        result[field] = value

    variables = result.get("variables", {})
    if not isinstance(variables, dict):
        raise _invalid_template("Field 'variables' must be an object", tpl_id)
    for var_name, default in variables.items():
        if not VARIABLE_NAME_RE.match(var_name):
            raise _invalid_template(f"Invalid variable name '{var_name}'", tpl_id)
        if not isinstance(default, str):
            raise _invalid_template(f"Default value of variable '{var_name}' must be a string", tpl_id)
    result["variables"] = dict(variables)
    return result


def validate_library(data):
    """Return a normalized copy of the library, or raise InvalidData."""
    if not isinstance(data, dict):
        raise _invalid_library("Library must be an object")

    version = data.get("version")
    if not isinstance(version, int) or isinstance(version, bool):
        raise _invalid_library("Field 'version' is required and must be an integer")
    if version > LIBRARY_VERSION:
        raise _invalid_library(f"Library version {version} is newer than supported ({LIBRARY_VERSION})")
    if version < 1:
        raise _invalid_library(f"Unknown library version {version}")

    templates = data.get("templates")
    if not isinstance(templates, list):
        raise _invalid_library("Field 'templates' must be an array")

    normalized = []
    seen = set()
    for item in templates:
        tpl = validate_template(item)
        if tpl["id"] in seen:
            raise _invalid_library(f"Duplicate template id '{tpl['id']}'")
        seen.add(tpl["id"])
        normalized.append(tpl)

    result = dict(data)
    result["templates"] = normalized
    return result


def make_id(name, existing_ids):
    """Build a unique id from a display name (e.g. 'Fantasy Scene' -> 'fantasy_scene')."""
    base = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")[:90] or "template"
    existing = set(existing_ids)
    candidate = base
    n = 2
    while candidate in existing:
        candidate = f"{base}_{n}"
        n += 1
    return candidate
