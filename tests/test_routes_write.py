"""Write endpoints: POST/PUT/DELETE /templates (editor phase)."""

import json

import pytest

from test_routes import TPL, call


@pytest.fixture
def lib_path(tmp_path):
    path = tmp_path / "templates.json"
    path.write_text(json.dumps({"version": 1, "templates": [TPL]}), encoding="utf-8")
    return path


def revision(lib_path):
    return call(lib_path, "GET", "/templates")[1]["revision"]


def stored(lib_path):
    return json.loads(lib_path.read_text(encoding="utf-8"))["templates"]


# --- POST /templates -----------------------------------------------------

def test_create_template(lib_path):
    rev = revision(lib_path)
    status, body = call(lib_path, "POST", "/templates", json={
        "template": {"name": "New One", "template": "{x}", "variables": {"x": ""}},
        "base_revision": rev,
    })
    assert status == 201
    assert body["template"]["id"] == "new_one"
    assert body["revision"] != rev
    assert [t["id"] for t in stored(lib_path)] == ["scene", "new_one"]


def test_create_duplicate_id_is_409(lib_path):
    status, body = call(lib_path, "POST", "/templates", json={"template": TPL, "base_revision": revision(lib_path)})
    assert status == 409
    assert body["error"]["code"] == "DUPLICATE_ID"


def test_create_with_stale_revision_is_409(lib_path):
    status, body = call(lib_path, "POST", "/templates", json={
        "template": {"name": "X", "template": ""}, "base_revision": "stale"})
    assert status == 409
    assert body["error"]["code"] == "CONFLICT"
    assert body["error"]["details"]["revision"] == revision(lib_path)


def test_create_invalid_template_is_422(lib_path):
    status, body = call(lib_path, "POST", "/templates", json={
        "template": {"name": "", "template": ""}, "base_revision": revision(lib_path)})
    assert status == 422
    assert body["error"]["code"] == "INVALID_TEMPLATE"


@pytest.mark.parametrize("payload", [
    {"template": {"name": "X", "template": ""}},                     # no base_revision
    {"base_revision": "r"},                                            # no template
    {"template": "not an object", "base_revision": "r"},
])
def test_create_bad_request(lib_path, payload):
    status, body = call(lib_path, "POST", "/templates", json=payload)
    assert status == 400
    assert body["error"]["code"] == "BAD_REQUEST"


# --- PUT /templates/{id} -------------------------------------------------

def test_update_template(lib_path):
    status, body = call(lib_path, "PUT", "/templates/scene", json={
        "template": dict(TPL, name="Renamed"), "base_revision": revision(lib_path)})
    assert status == 200
    assert body["template"]["name"] == "Renamed"
    assert stored(lib_path)[0]["name"] == "Renamed"


def test_update_unknown_is_404(lib_path):
    status, _ = call(lib_path, "PUT", "/templates/nope", json={
        "template": dict(TPL, id="nope"), "base_revision": revision(lib_path)})
    assert status == 404


def test_update_cannot_change_id(lib_path):
    status, _ = call(lib_path, "PUT", "/templates/scene", json={
        "template": dict(TPL, id="other"), "base_revision": revision(lib_path)})
    assert status == 422


def test_update_with_stale_revision_is_409(lib_path):
    status, _ = call(lib_path, "PUT", "/templates/scene", json={"template": TPL, "base_revision": "stale"})
    assert status == 409


# --- DELETE /templates/{id} ----------------------------------------------

def test_delete_template(lib_path):
    rev = revision(lib_path)
    status, body = call(lib_path, "DELETE", f"/templates/scene?base_revision={rev}")
    assert status == 200
    assert body["revision"] != rev
    assert stored(lib_path) == []


def test_delete_requires_base_revision(lib_path):
    status, _ = call(lib_path, "DELETE", "/templates/scene")
    assert status == 400


def test_delete_unknown_is_404(lib_path):
    status, _ = call(lib_path, "DELETE", f"/templates/nope?base_revision={revision(lib_path)}")
    assert status == 404


def test_delete_with_stale_revision_is_409(lib_path):
    status, _ = call(lib_path, "DELETE", "/templates/scene?base_revision=stale")
    assert status == 409


# --- corrupt library -----------------------------------------------------

def test_writes_are_refused_when_library_is_corrupt(lib_path):
    lib_path.write_text("{ broken", encoding="utf-8")
    status, body = call(lib_path, "POST", "/templates", json={
        "template": {"name": "X", "template": ""}, "base_revision": "any"})
    assert status == 503
    assert body["error"]["code"] == "LIBRARY_CORRUPT"
    assert lib_path.read_text(encoding="utf-8") == "{ broken"
