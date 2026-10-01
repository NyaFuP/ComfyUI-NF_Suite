import json

import pytest

from NF_Suite.core.errors import Conflict, InvalidData, NotFound, StorageCorrupt
from NF_Suite.nodes.prompt_template.library import TemplateLibrary


def tpl(**overrides):
    data = {"id": "scene", "name": "Scene", "template": "{a}", "variables": {"a": "x"}}
    data.update(overrides)
    return data


@pytest.fixture
def lib(tmp_path):
    return TemplateLibrary(str(tmp_path / "templates.json"))


def test_new_library_is_empty_without_seed(lib):
    data, revision = lib.list()
    assert data == {"version": 1, "templates": []}
    assert revision


def test_new_library_is_initialized_from_seed(tmp_path):
    seed = tmp_path / "seed.json"
    seed.write_text(json.dumps({"version": 1, "templates": [tpl()]}), encoding="utf-8")
    lib = TemplateLibrary(str(tmp_path / "templates.json"), seed_path=str(seed))
    data, _ = lib.list()
    assert [t["id"] for t in data["templates"]] == ["scene"]


def test_invalid_seed_falls_back_to_empty(tmp_path):
    seed = tmp_path / "seed.json"
    seed.write_text("{ broken", encoding="utf-8")
    lib = TemplateLibrary(str(tmp_path / "templates.json"), seed_path=str(seed))
    assert lib.list()[0]["templates"] == []


def test_create_and_get(lib):
    _, rev = lib.list()
    created, new_rev = lib.create(tpl(), base_revision=rev)
    assert created["id"] == "scene"
    assert created["negative_prompt"] == ""
    template, rev_after = lib.get("scene")
    assert template == created
    assert rev_after == new_rev


def test_create_generates_id_from_name_when_missing(lib):
    _, rev = lib.list()
    data = tpl(name="Fantasy Scene")
    del data["id"]
    created, _ = lib.create(data, base_revision=rev)
    assert created["id"] == "fantasy_scene"


def test_create_generated_id_avoids_existing(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(id="fantasy_scene"), base_revision=rev)
    data = tpl(name="Fantasy Scene")
    del data["id"]
    created, _ = lib.create(data, base_revision=rev)
    assert created["id"] == "fantasy_scene_2"


def test_create_with_existing_id_conflicts(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(), base_revision=rev)
    with pytest.raises(Conflict) as exc:
        lib.create(tpl(), base_revision=rev)
    assert exc.value.code == "DUPLICATE_ID"


def test_create_rejects_invalid_template(lib):
    _, rev = lib.list()
    with pytest.raises(InvalidData):
        lib.create(tpl(name=""), base_revision=rev)


def test_get_unknown_raises_not_found(lib):
    with pytest.raises(NotFound):
        lib.get("nope")


def test_update_replaces_template(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(), base_revision=rev)
    updated, _ = lib.update("scene", tpl(name="Renamed"), base_revision=rev)
    assert updated["name"] == "Renamed"
    assert lib.get("scene")[0]["name"] == "Renamed"


def test_update_keeps_position_in_list(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(id="a"), base_revision=rev)
    _, rev = lib.create(tpl(id="b"), base_revision=rev)
    _, rev = lib.update("a", tpl(id="a", name="A2"), base_revision=rev)
    assert [t["id"] for t in lib.list()[0]["templates"]] == ["a", "b"]


def test_update_fills_id_from_path(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(), base_revision=rev)
    data = tpl(name="No id in body")
    del data["id"]
    updated, _ = lib.update("scene", data, base_revision=rev)
    assert updated["id"] == "scene"


def test_update_cannot_change_id(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(), base_revision=rev)
    with pytest.raises(InvalidData):
        lib.update("scene", tpl(id="other"), base_revision=rev)


def test_update_unknown_raises_not_found(lib):
    _, rev = lib.list()
    with pytest.raises(NotFound):
        lib.update("nope", tpl(id="nope"), base_revision=rev)


def test_delete(lib):
    _, rev = lib.list()
    _, rev = lib.create(tpl(), base_revision=rev)
    lib.delete("scene", base_revision=rev)
    with pytest.raises(NotFound):
        lib.get("scene")


def test_delete_unknown_raises_not_found(lib):
    _, rev = lib.list()
    with pytest.raises(NotFound):
        lib.delete("nope", base_revision=rev)


def test_stale_revision_conflicts(lib):
    _, rev = lib.list()
    lib.create(tpl(), base_revision=rev)
    with pytest.raises(Conflict) as exc:
        lib.create(tpl(id="other"), base_revision=rev)
    assert exc.value.code == "CONFLICT"


def test_corrupt_file_reports_library_corrupt(tmp_path):
    path = tmp_path / "templates.json"
    path.write_text("{ broken", encoding="utf-8")
    lib = TemplateLibrary(str(path))
    with pytest.raises(StorageCorrupt) as exc:
        lib.list()
    assert exc.value.code == "LIBRARY_CORRUPT"


def test_find_returns_none_for_unknown(lib):
    assert lib.find("nope") is None
    _, rev = lib.list()
    lib.create(tpl(), base_revision=rev)
    assert lib.find("scene")["name"] == "Scene"
