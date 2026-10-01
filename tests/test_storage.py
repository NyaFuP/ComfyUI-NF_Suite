import json
import os

import pytest

from NF_Suite.core.errors import Conflict, InvalidData, StorageCorrupt
from NF_Suite.core.storage import JsonDocumentStore


def default_doc():
    return {"version": 1, "items": []}


def validate(doc):
    if not isinstance(doc, dict) or "items" not in doc:
        raise InvalidData("missing items")
    return doc


@pytest.fixture
def path(tmp_path):
    return tmp_path / "sub" / "doc.json"


@pytest.fixture
def store(path):
    return JsonDocumentStore(str(path), initial=default_doc, validator=validate)


def write_raw(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def test_read_creates_file_from_initial_when_missing(store, path):
    doc, revision = store.read()
    assert doc == default_doc()
    assert path.exists()
    assert json.loads(path.read_text(encoding="utf-8")) == default_doc()
    assert isinstance(revision, str) and revision


def test_revision_is_stable_for_unchanged_file(store):
    _, rev1 = store.read()
    _, rev2 = store.read()
    assert rev1 == rev2


def test_update_applies_change_and_returns_new_revision(store, path):
    _, rev = store.read()
    doc, new_rev = store.update(lambda d: {**d, "items": ["a"]}, base_revision=rev)
    assert doc["items"] == ["a"]
    assert new_rev != rev
    assert json.loads(path.read_text(encoding="utf-8"))["items"] == ["a"]
    assert store.read()[1] == new_rev


def test_update_with_stale_revision_raises_conflict(store, path):
    _, rev = store.read()
    store.update(lambda d: {**d, "items": ["first"]}, base_revision=rev)
    with pytest.raises(Conflict):
        store.update(lambda d: {**d, "items": ["second"]}, base_revision=rev)
    assert json.loads(path.read_text(encoding="utf-8"))["items"] == ["first"]


def test_external_edit_is_picked_up_and_changes_revision(store, path):
    _, rev = store.read()
    write_raw(path, json.dumps({"version": 1, "items": ["external"]}))
    doc, new_rev = store.read()
    assert doc["items"] == ["external"]
    assert new_rev != rev


def test_broken_json_raises_storage_corrupt(store, path):
    write_raw(path, "{ not json")
    with pytest.raises(StorageCorrupt) as exc:
        store.read()
    assert exc.value.code == "STORAGE_CORRUPT"


def test_invalid_document_raises_storage_corrupt_with_reason(store, path):
    write_raw(path, json.dumps({"version": 1}))
    with pytest.raises(StorageCorrupt) as exc:
        store.read()
    assert "missing items" in exc.value.message


def test_corrupt_file_is_never_overwritten(store, path):
    write_raw(path, "{ not json")
    with pytest.raises(StorageCorrupt):
        store.update(lambda d: default_doc(), base_revision="anything")
    assert path.read_text(encoding="utf-8") == "{ not json"


def test_update_validates_new_document_before_writing(store, path):
    _, rev = store.read()
    with pytest.raises(InvalidData):
        store.update(lambda d: {"broken": True}, base_revision=rev)
    assert json.loads(path.read_text(encoding="utf-8")) == default_doc()


def test_write_leaves_no_temp_files(store, path):
    _, rev = store.read()
    store.update(lambda d: {**d, "items": ["a"]}, base_revision=rev)
    assert os.listdir(path.parent) == ["doc.json"]


def test_non_ascii_is_written_readably(store, path):
    _, rev = store.read()
    store.update(lambda d: {**d, "items": ["夕暮れ"]}, base_revision=rev)
    assert "夕暮れ" in path.read_text(encoding="utf-8")


def test_utf8_bom_file_can_be_read(store, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"\xef\xbb\xbf" + json.dumps({"version": 1, "items": []}).encode())
    assert store.read()[0]["items"] == []
