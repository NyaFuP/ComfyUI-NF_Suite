import pytest

from NF_Suite.core.errors import InvalidData
from NF_Suite.nodes.prompt_template.schema import (
    LIBRARY_VERSION,
    empty_library,
    make_id,
    validate_library,
    validate_template,
)


def valid_template(**overrides):
    tpl = {
        "id": "fantasy_01",
        "name": "Fantasy Scene",
        "category": "Scene",
        "template": "{quality}",
        "negative_prompt": "blurry",
        "variables": {"quality": "masterpiece"},
    }
    tpl.update(overrides)
    return tpl


# --- validate_template ---------------------------------------------------

def test_valid_template_is_returned_normalized():
    assert validate_template(valid_template()) == valid_template()


def test_optional_fields_get_defaults():
    tpl = validate_template({"id": "a", "name": "A", "template": "x"})
    assert tpl == {"id": "a", "name": "A", "category": "", "template": "x",
                   "negative_prompt": "", "variables": {}}


def test_unknown_fields_are_preserved():
    tpl = validate_template(valid_template(note="keep me"))
    assert tpl["note"] == "keep me"


@pytest.mark.parametrize("field", ["id", "name", "template"])
def test_required_fields(field):
    tpl = valid_template()
    del tpl[field]
    with pytest.raises(InvalidData) as exc:
        validate_template(tpl)
    assert exc.value.code == "INVALID_TEMPLATE"
    assert field in exc.value.message


@pytest.mark.parametrize("bad_id", ["", "has space", "日本語", "a/b", "x" * 101])
def test_rejects_bad_ids(bad_id):
    with pytest.raises(InvalidData):
        validate_template(valid_template(id=bad_id))


def test_rejects_blank_name():
    with pytest.raises(InvalidData):
        validate_template(valid_template(name="  "))


def test_rejects_non_string_variable_values():
    with pytest.raises(InvalidData):
        validate_template(valid_template(variables={"a": 1}))


def test_rejects_non_identifier_variable_names():
    with pytest.raises(InvalidData):
        validate_template(valid_template(variables={"bad name": "x"}))


def test_rejects_non_dict():
    with pytest.raises(InvalidData):
        validate_template(["not", "a", "dict"])


# --- validate_library ----------------------------------------------------

def test_empty_library():
    assert empty_library() == {"version": LIBRARY_VERSION, "templates": []}
    assert validate_library(empty_library()) == empty_library()


def test_library_requires_version():
    with pytest.raises(InvalidData) as exc:
        validate_library({"templates": []})
    assert exc.value.code == "INVALID_LIBRARY"


def test_library_rejects_future_version():
    with pytest.raises(InvalidData):
        validate_library({"version": LIBRARY_VERSION + 1, "templates": []})


def test_library_rejects_duplicate_ids():
    lib = {"version": 1, "templates": [valid_template(), valid_template()]}
    with pytest.raises(InvalidData) as exc:
        validate_library(lib)
    assert "fantasy_01" in exc.value.message


def test_library_validates_each_template():
    lib = {"version": 1, "templates": [valid_template(name="")]}
    with pytest.raises(InvalidData):
        validate_library(lib)


def test_bundled_example_library_is_valid():
    import json
    import os

    path = os.path.join(os.path.dirname(__file__), "..", "examples", "templates.example.json")
    with open(path, encoding="utf-8") as f:
        assert validate_library(json.load(f))["templates"]


# --- make_id -------------------------------------------------------------

def test_make_id_slugifies_name():
    assert make_id("Fantasy Scene", []) == "fantasy_scene"


def test_make_id_avoids_existing_ids():
    assert make_id("Fantasy Scene", ["fantasy_scene"]) == "fantasy_scene_2"
    assert make_id("Fantasy Scene", ["fantasy_scene", "fantasy_scene_2"]) == "fantasy_scene_3"


def test_make_id_falls_back_for_non_ascii_names():
    assert make_id("夕暮れの街", []) == "template"
    assert make_id("夕暮れの街", ["template"]) == "template_2"
