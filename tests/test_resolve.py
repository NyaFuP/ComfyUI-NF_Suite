import json

import pytest

from NF_Suite.core.errors import InvalidData, NotFound, StorageCorrupt
from NF_Suite.nodes.prompt_template.resolve import (
    content_hash,
    parse_snapshot,
    parse_variables,
    resolve_template,
)

LIB_TPL = {"id": "scene", "name": "Scene", "category": "", "template": "{a} lib",
           "negative_prompt": "", "variables": {"a": "x"}}
SNAP_TPL = dict(LIB_TPL, template="{a} snap", captured_at="2026-09-29T00:00:00Z")


def lookup_from(templates):
    return lambda template_id: templates.get(template_id)


def codes(warnings):
    return [w["code"] for w in warnings]


# --- parse_variables -----------------------------------------------------

def test_parse_variables_empty_string_is_empty_dict():
    assert parse_variables("") == {}
    assert parse_variables("   ") == {}


def test_parse_variables_json_object():
    assert parse_variables('{"a": "1", "b": ""}') == {"a": "1", "b": ""}


@pytest.mark.parametrize("raw", ["{broken", "[1, 2]", '{"a": 1}'])
def test_parse_variables_rejects_invalid(raw):
    with pytest.raises(InvalidData) as exc:
        parse_variables(raw)
    assert exc.value.code == "INVALID_VARIABLES"


# --- parse_snapshot ------------------------------------------------------

def test_parse_snapshot_empty_is_none():
    assert parse_snapshot("") is None


def test_parse_snapshot_keeps_extra_fields():
    snap = parse_snapshot(json.dumps(SNAP_TPL))
    assert snap["captured_at"] == "2026-09-29T00:00:00Z"


@pytest.mark.parametrize("raw", ["{broken", json.dumps({"id": "x"})])
def test_parse_snapshot_rejects_invalid(raw):
    with pytest.raises(InvalidData) as exc:
        parse_snapshot(raw)
    assert exc.value.code == "INVALID_SNAPSHOT"


# --- resolve_template ----------------------------------------------------

def test_library_template_is_used_by_default():
    r = resolve_template(lookup_from({"scene": LIB_TPL}), "scene", None, pin_snapshot=False)
    assert r.source == "library"
    assert r.template["template"] == "{a} lib"
    assert r.warnings == []


def test_outdated_snapshot_is_reported_but_library_wins():
    r = resolve_template(lookup_from({"scene": LIB_TPL}), "scene", SNAP_TPL, pin_snapshot=False)
    assert r.source == "library"
    assert codes(r.warnings) == ["snapshot_outdated"]


def test_matching_snapshot_has_no_warning():
    snap = dict(LIB_TPL, captured_at="t")
    r = resolve_template(lookup_from({"scene": LIB_TPL}), "scene", snap, pin_snapshot=False)
    assert r.warnings == []


def test_pinned_snapshot_wins():
    r = resolve_template(lookup_from({"scene": LIB_TPL}), "scene", SNAP_TPL, pin_snapshot=True)
    assert r.source == "snapshot"
    assert r.template["template"] == "{a} snap"


def test_pinned_without_snapshot_is_an_error():
    with pytest.raises(InvalidData) as exc:
        resolve_template(lookup_from({"scene": LIB_TPL}), "scene", None, pin_snapshot=True)
    assert exc.value.code == "SNAPSHOT_MISSING"


def test_missing_template_falls_back_to_snapshot():
    r = resolve_template(lookup_from({}), "scene", SNAP_TPL, pin_snapshot=False)
    assert r.source == "snapshot"
    assert codes(r.warnings) == ["template_missing"]


def test_snapshot_of_another_template_is_not_used():
    with pytest.raises(NotFound):
        resolve_template(lookup_from({}), "other", SNAP_TPL, pin_snapshot=False)


def test_missing_template_without_snapshot_is_not_found():
    with pytest.raises(NotFound):
        resolve_template(lookup_from({}), "scene", None, pin_snapshot=False)


def test_empty_template_id_is_an_error():
    with pytest.raises(InvalidData) as exc:
        resolve_template(lookup_from({}), "", None, pin_snapshot=False)
    assert exc.value.code == "NO_TEMPLATE"


def test_corrupt_library_falls_back_to_snapshot():
    def broken(_):
        raise StorageCorrupt("broken", code="LIBRARY_CORRUPT")

    r = resolve_template(broken, "scene", SNAP_TPL, pin_snapshot=False)
    assert r.source == "snapshot"
    assert codes(r.warnings) == ["library_unavailable"]


def test_corrupt_library_without_snapshot_raises():
    def broken(_):
        raise StorageCorrupt("broken", code="LIBRARY_CORRUPT")

    with pytest.raises(StorageCorrupt):
        resolve_template(broken, "scene", None, pin_snapshot=False)


def test_pinned_snapshot_does_not_touch_library():
    def broken(_):
        raise AssertionError("library should not be read")

    r = resolve_template(broken, "scene", SNAP_TPL, pin_snapshot=True)
    assert r.source == "snapshot"


# --- content_hash --------------------------------------------------------

def test_content_hash_ignores_metadata():
    assert content_hash(LIB_TPL) == content_hash(dict(LIB_TPL, name="Other", captured_at="t"))


def test_content_hash_changes_with_content():
    assert content_hash(LIB_TPL) != content_hash(SNAP_TPL)
