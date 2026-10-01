"""Template library operations on top of JsonDocumentStore (no ComfyUI imports)."""

import json
import logging

from ...core.errors import Conflict, InvalidData, NotFound
from ...core.storage import JsonDocumentStore
from .schema import empty_library, make_id, validate_library, validate_template

logger = logging.getLogger(__name__)


def _load_seed(seed_path):
    if not seed_path:
        return empty_library()
    try:
        with open(seed_path, encoding="utf-8-sig") as f:
            return validate_library(json.load(f))
    except (OSError, ValueError, InvalidData) as e:
        logger.warning("[NF_Suite] Ignoring invalid seed %s: %s", seed_path, e)
        return empty_library()


def _index_of(templates, template_id):
    for i, tpl in enumerate(templates):
        if tpl["id"] == template_id:
            return i
    return -1


def _not_found(template_id):
    return NotFound(f"Template '{template_id}' not found", details={"id": template_id})


class TemplateLibrary:
    def __init__(self, path, seed_path=None):
        self.store = JsonDocumentStore(
            path,
            initial=lambda: _load_seed(seed_path),
            validator=validate_library,
            corrupt_code="LIBRARY_CORRUPT",
        )

    @property
    def path(self):
        return self.store.path

    def list(self):
        """Return (library, revision)."""
        return self.store.read()

    def find(self, template_id):
        """Return the template or None. Raises StorageCorrupt if the file is broken."""
        library, _ = self.store.read()
        i = _index_of(library["templates"], template_id)
        return library["templates"][i] if i >= 0 else None

    def get(self, template_id):
        """Return (template, revision)."""
        library, revision = self.store.read()
        i = _index_of(library["templates"], template_id)
        if i < 0:
            raise _not_found(template_id)
        return library["templates"][i], revision

    def create(self, data, base_revision):
        """Add a template. A missing id is generated from the name. Returns (template, revision)."""
        created = {}

        def change(library):
            templates = library["templates"]
            item = dict(data) if isinstance(data, dict) else data
            if isinstance(item, dict) and not item.get("id") and isinstance(item.get("name"), str):
                item["id"] = make_id(item["name"], [t["id"] for t in templates])
            tpl = validate_template(item)
            if _index_of(templates, tpl["id"]) >= 0:
                raise Conflict(
                    f"Template id '{tpl['id']}' already exists", code="DUPLICATE_ID", details={"id": tpl["id"]}
                )
            created["template"] = tpl
            return {**library, "templates": templates + [tpl]}

        _, revision = self.store.update(change, base_revision)
        return created["template"], revision

    def update(self, template_id, data, base_revision):
        """Replace a template in place. The id cannot be changed. Returns (template, revision)."""
        updated = {}

        def change(library):
            templates = list(library["templates"])
            i = _index_of(templates, template_id)
            if i < 0:
                raise _not_found(template_id)
            item = dict(data) if isinstance(data, dict) else data
            if isinstance(item, dict):
                item.setdefault("id", template_id)
                if item["id"] != template_id:
                    raise InvalidData(
                        "Template id cannot be changed", code="INVALID_TEMPLATE", details={"id": template_id}
                    )
            tpl = validate_template(item)
            templates[i] = tpl
            updated["template"] = tpl
            return {**library, "templates": templates}

        _, revision = self.store.update(change, base_revision)
        return updated["template"], revision

    def delete(self, template_id, base_revision):
        """Remove a template. Returns the new revision."""

        def change(library):
            templates = library["templates"]
            if _index_of(templates, template_id) < 0:
                raise _not_found(template_id)
            return {**library, "templates": [t for t in templates if t["id"] != template_id]}

        _, revision = self.store.update(change, base_revision)
        return revision
