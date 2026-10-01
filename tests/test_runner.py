import json

import pytest

from NF_Suite.core.errors import InvalidData, NotFound
from NF_Suite.nodes.prompt_template.runner import fingerprint, run, validate

TPL = {"id": "scene", "name": "Scene", "category": "", "template": "{a}, {b}",
       "negative_prompt": "bad", "variables": {"a": "x", "b": "y"}}


def lookup(templates):
    return lambda template_id: templates.get(template_id)


def test_run_expands_library_template():
    result = run(lookup({"scene": TPL}), "scene", '{"b": "z"}', "", False)
    assert result["positive"] == "x, z"
    assert result["negative"] == "bad"
    assert result["source"] == "library"


def test_run_merges_resolution_and_expansion_warnings():
    snap = json.dumps(dict(TPL, template="{a} {c}"))
    result = run(lookup({}), "scene", "", snap, False)
    assert result["source"] == "snapshot"
    assert [w["code"] for w in result["warnings"]] == ["template_missing", "undefined_variable", "unused_variable"]


def test_run_raises_for_unknown_template():
    with pytest.raises(NotFound):
        run(lookup({}), "scene", "", "", False)


def test_run_raises_for_bad_variables_json():
    with pytest.raises(InvalidData):
        run(lookup({"scene": TPL}), "scene", "{bad", "", False)


def test_validate_returns_true_when_runnable():
    assert validate(lookup({"scene": TPL}), "scene", "{}", "", False) is True


def test_validate_returns_message_when_not_runnable():
    message = validate(lookup({}), "scene", "{}", "", False)
    assert isinstance(message, str)
    assert "scene" in message


def test_fingerprint_changes_when_library_changes():
    fp1 = fingerprint(lookup({"scene": TPL}), "scene", "{}", "", False)
    fp2 = fingerprint(lookup({"scene": dict(TPL, template="{a}")}), "scene", "{}", "", False)
    assert fp1 != fp2


def test_fingerprint_changes_when_variables_change():
    fp1 = fingerprint(lookup({"scene": TPL}), "scene", '{"a": "1"}', "", False)
    fp2 = fingerprint(lookup({"scene": TPL}), "scene", '{"a": "2"}', "", False)
    assert fp1 != fp2


def test_fingerprint_is_stable():
    args = (lookup({"scene": TPL}), "scene", "{}", "", False)
    assert fingerprint(*args) == fingerprint(*args)


def test_fingerprint_ignores_name_changes():
    fp1 = fingerprint(lookup({"scene": TPL}), "scene", "{}", "", False)
    fp2 = fingerprint(lookup({"scene": dict(TPL, name="Renamed")}), "scene", "{}", "", False)
    assert fp1 == fp2


def test_fingerprint_does_not_raise_when_unresolvable():
    assert isinstance(fingerprint(lookup({}), "scene", "{}", "", False), str)
