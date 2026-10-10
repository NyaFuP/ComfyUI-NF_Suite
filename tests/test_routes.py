import asyncio
import json

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from NF_Suite.nodes.prompt_template.library import TemplateLibrary
from NF_Suite.nodes.prompt_template.routes import PREFIX, register_routes

TPL = {"id": "scene", "name": "Scene", "template": "{a}, {b}", "negative_prompt": "bad",
       "variables": {"a": "x", "b": "y"}}


@pytest.fixture
def lib_path(tmp_path):
    path = tmp_path / "templates.json"
    path.write_text(json.dumps({"version": 1, "templates": [TPL]}), encoding="utf-8")
    return path


def call(lib_path, method, url, **kwargs):
    """Run one request against a fresh app and return (status, json)."""

    async def run():
        routes = web.RouteTableDef()
        library = TemplateLibrary(str(lib_path))
        register_routes(routes, lambda: library)
        app = web.Application()
        app.add_routes(routes)
        async with TestClient(TestServer(app)) as client:
            resp = await client.request(method, PREFIX + url, **kwargs)
            return resp.status, await resp.json()

    return asyncio.run(run())


def test_list_templates(lib_path):
    status, body = call(lib_path, "GET", "/templates")
    assert status == 200
    assert body["version"] == 1
    assert [t["id"] for t in body["templates"]] == ["scene"]
    assert body["revision"]
    assert body["warnings"] == []


def test_get_template(lib_path):
    status, body = call(lib_path, "GET", "/templates/scene")
    assert status == 200
    assert body["template"]["name"] == "Scene"
    assert body["revision"]


def test_get_unknown_template_is_404(lib_path):
    status, body = call(lib_path, "GET", "/templates/nope")
    assert status == 404
    assert body["error"]["code"] == "NOT_FOUND"


def test_corrupt_library_is_503(lib_path):
    lib_path.write_text("{ broken", encoding="utf-8")
    status, body = call(lib_path, "GET", "/templates")
    assert status == 503
    assert body["error"]["code"] == "LIBRARY_CORRUPT"
    assert lib_path.read_text(encoding="utf-8") == "{ broken"


def test_expand_by_template_id(lib_path):
    status, body = call(lib_path, "POST", "/expand", json={"template_id": "scene", "variables": {"b": ""}})
    assert status == 200
    assert body == {"positive": "x", "negative": "bad", "warnings": []}


def test_expand_inline_template(lib_path):
    inline = dict(TPL, id="draft", template="{a} {missing}")
    status, body = call(lib_path, "POST", "/expand", json={"template": inline, "variables": {}})
    assert status == 200
    assert body["positive"] == "x {missing}"
    assert [w["code"] for w in body["warnings"]] == ["undefined_variable", "unused_variable"]


def test_expand_with_inputs(lib_path):
    inline = dict(TPL, id="draft", template="{a}, {input1}")
    status, body = call(lib_path, "POST", "/expand", json={"template": inline, "variables": {}, "inputs": {"input1": "linked"}})
    assert status == 200
    assert body["positive"] == "x, linked"


def test_expand_unknown_template_is_404(lib_path):
    status, _ = call(lib_path, "POST", "/expand", json={"template_id": "nope"})
    assert status == 404


def test_expand_invalid_inline_template_is_422(lib_path):
    status, body = call(lib_path, "POST", "/expand", json={"template": {"id": "x"}})
    assert status == 422
    assert body["error"]["code"] == "INVALID_TEMPLATE"


@pytest.mark.parametrize("payload", [
    {},
    {"template_id": "scene", "variables": {"a": 1}},
    {"template_id": "scene", "variables": "nope"},
    {"template_id": "scene", "variables": {}, "inputs": {"input1": 1}},
    {"template_id": "scene", "variables": {}, "inputs": {"text": "x"}},
    {"template_id": "scene", "variables": {}, "inputs": "x"},
])
def test_expand_bad_request(lib_path, payload):
    status, body = call(lib_path, "POST", "/expand", json=payload)
    assert status == 400
    assert body["error"]["code"] == "BAD_REQUEST"


def test_expand_non_json_body_is_400(lib_path):
    status, _ = call(lib_path, "POST", "/expand", data="not json")
    assert status == 400


@pytest.mark.parametrize("content", ["{ broken", '{"version": 1, "templates": "nope"}'])
def test_corrupt_library_error_does_not_reveal_the_path(lib_path, content):
    lib_path.write_text(content, encoding="utf-8")
    status, body = call(lib_path, "GET", "/templates")
    assert status == 503
    assert str(lib_path.parent) not in json.dumps(body)
    assert lib_path.name not in json.dumps(body)


def test_bad_json_body_error_has_no_parser_details(lib_path):
    _, body = call(lib_path, "POST", "/expand", data="{ not json")
    assert body["error"]["message"] == "Request body must be JSON"
