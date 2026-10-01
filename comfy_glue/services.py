"""Process-wide service instances shared by nodes and routes."""

import functools

from ..nodes.preview_selector.store import BatchStore
from ..nodes.prompt_template.library import TemplateLibrary
from .paths import TEMPLATE_SEED_PATH, get_preview_batch_dir, get_template_path


@functools.lru_cache(maxsize=1)
def get_batch_store() -> BatchStore:
    return BatchStore(get_preview_batch_dir())


@functools.lru_cache(maxsize=1)
def get_template_library() -> TemplateLibrary:
    return TemplateLibrary(get_template_path(), seed_path=TEMPLATE_SEED_PATH)


def lookup_template(template_id):
    """lookup callable for the runner: template dict or None (raises StorageCorrupt if broken)."""
    return get_template_library().find(template_id)
