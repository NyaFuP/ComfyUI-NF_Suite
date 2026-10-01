"""V3 extension entry: registers nodes and HTTP routes with ComfyUI."""

import logging

from typing_extensions import override

from comfy_api.latest import ComfyAPI, ComfyExtension, io
from server import PromptServer

from ..nodes.empty_latent.node import EmptyLatentImage, PresetEmptyLatentImage
from ..nodes.independent_queue.node import IndependentQueue, IndependentQueueRun
from ..nodes.preview_selector.node import PreviewSelector, PreviewSelectorSource
from ..nodes.prompt_template.node import PromptTemplate
from ..nodes.prompt_template.routes import register_routes as register_prompt_template_routes
from .services import get_template_library

logger = logging.getLogger(__name__)

# NF_Tools (removed 2026-10-01): NFPreviewSelector2 -> NF_PreviewSelector.
# Workflows that still contain the old node get a "Replace" option in the frontend.
# NFEmptyLatentImage / NFPresetEmptyLatentImage kept their node ids, so they need no replacement.
PREVIEW_SELECTOR_2_REPLACEMENT = io.NodeReplace(
    new_node_id="NF_PreviewSelector",
    old_node_id="NFPreviewSelector2",
    old_widget_ids=["mode", "timeout"],  # V1 widget order; timeout no longer exists
    input_mapping=[
        {"new_id": "images", "old_id": "images"},
        {"new_id": "latents", "old_id": "latents"},
        {"new_id": "mode", "old_id": "mode"},
    ],
    output_mapping=[
        {"new_idx": 0, "old_idx": 0},  # selected_images
        {"new_idx": 1, "old_idx": 1},  # selected_latents
        {"new_idx": 2, "old_idx": 2},  # selection_indices
    ],
)


class NFSuiteExtension(ComfyExtension):
    @override
    async def on_load(self) -> None:
        # Called before PromptServer.add_routes(), so routes added here are served
        # (and mirrored under /api by ComfyUI).
        register_prompt_template_routes(PromptServer.instance.routes, get_template_library)
        logger.info("[NF_Suite] Prompt template library: %s", get_template_library().path)
        await ComfyAPI().node_replacement.register(PREVIEW_SELECTOR_2_REPLACEMENT)

    @override
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [
            PromptTemplate,
            IndependentQueue,
            IndependentQueueRun,
            PreviewSelector,
            PreviewSelectorSource,
            EmptyLatentImage,
            PresetEmptyLatentImage,
        ]
