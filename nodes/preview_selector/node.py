"""NF Preview Selector (V3). Logic lives in runner.py.

NF_PreviewSelector       : in the graph. Output node, so a normal Run (or the node's
                           [Generate] button) produces candidates. In review_and_select it
                           blocks downstream silently instead of waiting (principle 4).
NF_PreviewSelectorSource : swapped in by the frontend for [Continue]. No link inputs, so
                           the upstream is not executed; outputs the chosen candidates.
"""

from comfy_api.latest import io, ui
from comfy_execution.graph_utils import ExecutionBlocker

from ...comfy_glue.services import get_batch_store
from ...core.errors import NFError
from ..independent_queue.node import SEED_MODES
from . import runner
from .selection import MODES


def _outputs():
    return [
        io.Image.Output("selected_images", display_name="selected_images"),
        io.Latent.Output("selected_latents", display_name="selected_latents"),
        io.String.Output("selection_indices", display_name="selection_indices"),
    ]


class PreviewSelector(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NF_PreviewSelector",
            display_name="NF Preview Selector",
            category="NyaFu/image",
            description=(
                "Shows the images as a gallery. In review_and_select mode the downstream part waits "
                "until you pick images and press Continue (nothing is blocked while you choose)."
            ),
            inputs=[
                io.Image.Input("images"),
                io.Combo.Input("mode", options=MODES, default="review_and_select"),
                io.Combo.Input(
                    "seed_mode",
                    options=SEED_MODES,
                    default="randomize",
                    tooltip="Before Generate: randomize/follow/off upstream seeds (see NF Independent Queue).",
                ),
                io.Latent.Input("latents", optional=True),
            ],
            outputs=_outputs(),
            is_output_node=True,
            search_aliases=["preview selector", "image selector", "pick image", "choose image"],
        )

    @classmethod
    def execute(cls, images, mode, seed_mode, latents=None):
        def save_previews(imgs):
            return ui.ImageSaveHelper.save_images(
                imgs, filename_prefix="NFPreviewSelector", folder_type=io.FolderType.temp, cls=cls, compress_level=1
            )

        result = runner.run_selector(images, latents, mode, get_batch_store(), save_previews)
        if result["outputs"] is None:
            # Silent block: downstream nodes are skipped without an error.
            blocked = ExecutionBlocker(None)
            return io.NodeOutput(blocked, blocked, blocked, ui=result["ui"])
        return io.NodeOutput(*result["outputs"], ui=result["ui"])


class PreviewSelectorSource(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NF_PreviewSelectorSource",
            display_name="NF Preview Selector (continue)",
            category="NyaFu/image",
            description="Internal: queued by NF Preview Selector's Continue button.",
            inputs=[
                io.String.Input("batch_id", default=""),
                io.String.Input("selection", default=""),
            ],
            outputs=_outputs(),
            is_dev_only=True,
        )

    @classmethod
    def execute(cls, batch_id, selection):
        try:
            return io.NodeOutput(*runner.run_source(get_batch_store(), batch_id, selection))
        except NFError as e:
            raise RuntimeError(f"[NF Preview Selector] [{e.code}] {e.message}") from e
