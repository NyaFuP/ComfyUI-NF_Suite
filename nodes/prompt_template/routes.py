"""HTTP API for the Prompt Template node (aiohttp only, no ComfyUI imports).

Registered on PromptServer.instance.routes by comfy_glue; ComfyUI also serves every
route under /api, so the frontend calls these through api.fetchApi("/nyafu/...").
"""

import asyncio
import json
import logging

from aiohttp import web

from ...core.errors import BadRequest, NFError
from .expand import INPUT_VARS, expand_template
from .schema import validate_template

logger = logging.getLogger(__name__)

PREFIX = "/nyafu/prompt_template"


def _error_response(error: NFError):
    return web.json_response(error.to_dict(), status=error.status)


def _handle_errors(handler):
    async def wrapped(request):
        try:
            return await handler(request)
        except NFError as e:
            return _error_response(e)
        except Exception:
            logger.exception("[NF_Suite] Unhandled error in %s %s", request.method, request.path)
            return web.json_response(
                {"error": {"code": "INTERNAL_ERROR", "message": "Internal server error"}}, status=500
            )

    return wrapped


async def _json_body(request):
    try:
        body = await request.json()
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        raise BadRequest("Request body must be JSON") from e
    if not isinstance(body, dict):
        raise BadRequest("Request body must be a JSON object")
    return body


def _parse_variables(body):
    variables = body.get("variables", {})
    if not isinstance(variables, dict) or not all(isinstance(v, str) for v in variables.values()):
        raise BadRequest("'variables' must be an object of strings")
    return variables


def _require_revision(value):
    if not isinstance(value, str) or not value:
        raise BadRequest("'base_revision' is required (the revision the change is based on)")
    return value


def _parse_write_body(body):
    if not isinstance(body.get("template"), dict):
        raise BadRequest("'template' must be an object")
    return body["template"], _require_revision(body.get("base_revision"))


def register_routes(routes: web.RouteTableDef, get_library):
    """get_library: callable returning the TemplateLibrary (resolved lazily)."""

    @routes.get(PREFIX + "/templates")
    @_handle_errors
    async def list_templates(request):
        library, revision = await asyncio.to_thread(get_library().list)
        return web.json_response(
            {"version": library["version"], "revision": revision, "templates": library["templates"], "warnings": []}
        )

    @routes.get(PREFIX + "/templates/{id}")
    @_handle_errors
    async def get_template(request):
        template, revision = await asyncio.to_thread(get_library().get, request.match_info["id"])
        return web.json_response({"template": template, "revision": revision})

    @routes.post(PREFIX + "/templates")
    @_handle_errors
    async def create_template(request):
        template, base_revision = _parse_write_body(await _json_body(request))
        created, revision = await asyncio.to_thread(get_library().create, template, base_revision)
        return web.json_response({"template": created, "revision": revision}, status=201)

    @routes.put(PREFIX + "/templates/{id}")
    @_handle_errors
    async def update_template(request):
        template, base_revision = _parse_write_body(await _json_body(request))
        updated, revision = await asyncio.to_thread(
            get_library().update, request.match_info["id"], template, base_revision
        )
        return web.json_response({"template": updated, "revision": revision})

    @routes.delete(PREFIX + "/templates/{id}")
    @_handle_errors
    async def delete_template(request):
        base_revision = _require_revision(request.query.get("base_revision"))
        revision = await asyncio.to_thread(get_library().delete, request.match_info["id"], base_revision)
        return web.json_response({"revision": revision})

    @routes.post(PREFIX + "/expand")
    @_handle_errors
    async def expand(request):
        body = await _json_body(request)
        variables = _parse_variables(body)
        inputs = body.get("inputs", {})
        if not isinstance(inputs, dict) or not all(k in INPUT_VARS and isinstance(v, str) for k, v in inputs.items()):
            raise BadRequest(f"'inputs' must be an object of strings with keys from {list(INPUT_VARS)}")
        if isinstance(body.get("template"), dict):
            template = validate_template(body["template"])
        elif isinstance(body.get("template_id"), str) and body["template_id"]:
            template, _ = await asyncio.to_thread(get_library().get, body["template_id"])
        else:
            raise BadRequest("Either 'template_id' or 'template' is required")
        return web.json_response(expand_template(template, variables, inputs))
