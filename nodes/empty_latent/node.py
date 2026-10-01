"""NF Empty Latent Image / NF Preset Empty Latent Image (moved from NF_Tools).

node_ids, input names, input order, options and defaults are unchanged so that saved
workflows keep loading (widget values are restored by position).
"""

import torch

import comfy.model_management
from comfy_api.latest import io

from .dimensions import ASPECT_RATIOS, ORIENTATIONS, PRESETS, aspect_dimensions, preset_dimensions


def _outputs(width_tip):
    return [
        io.Latent.Output("latent", display_name="latent", tooltip="Empty Latent Image Batch"),
        io.Int.Output("width", display_name="width", tooltip=f"{width_tip} Width (pixels)"),
        io.Int.Output("height", display_name="height", tooltip=f"{width_tip} Height (pixels)"),
    ]


def _empty_latent(width, height, batch_size):
    device = comfy.model_management.intermediate_device()
    return {"samples": torch.zeros([batch_size, 4, height // 8, width // 8], device=device)}


class EmptyLatentImage(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NFEmptyLatentImage",
            display_name="NF Empty Latent Image",
            category="NyaFu/latent",
            description="Empty Latent Image from a long side, an aspect ratio and an orientation.",
            inputs=[
                io.Int.Input("long_side", default=1024, min=64, max=8192, step=64, tooltip="Size of the long side (pixels)"),
                io.Combo.Input("aspect_ratio", options=list(ASPECT_RATIOS), default="1:1", tooltip="Select aspect ratio"),
                io.Combo.Input(
                    "orientation", options=ORIENTATIONS, default="auto",
                    tooltip="Specify orientation (auto follows aspect ratio)",
                ),
                io.Int.Input("batch_size", default=1, min=1, max=4096, tooltip="Batch size"),
                io.Boolean.Input("force_multiple_of_64", default=True, tooltip="Force size to be a multiple of 64"),
            ],
            outputs=_outputs("Calculated"),
        )

    @classmethod
    def execute(cls, long_side, aspect_ratio, orientation, batch_size, force_multiple_of_64):
        width, height = aspect_dimensions(long_side, aspect_ratio, orientation, force_multiple_of_64)
        return io.NodeOutput(_empty_latent(width, height, batch_size), width, height)


class PresetEmptyLatentImage(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NFPresetEmptyLatentImage",
            display_name="NF Preset Empty Latent Image",
            category="NyaFu/latent",
            description="Empty Latent Image from a common size preset.",
            inputs=[
                io.Combo.Input("preset", options=list(PRESETS), default="SDXL (1024x1024)", tooltip="Select preset size"),
                io.Int.Input("batch_size", default=1, min=1, max=4096, tooltip="Batch size"),
                io.Int.Input(
                    "custom_width", default=1024, min=64, max=8192, step=64, optional=True,
                    tooltip="Custom width (only used when preset is Custom)",
                ),
                io.Int.Input(
                    "custom_height", default=1024, min=64, max=8192, step=64, optional=True,
                    tooltip="Custom height (only used when preset is Custom)",
                ),
            ],
            outputs=_outputs("Used"),
        )

    @classmethod
    def execute(cls, preset, batch_size, custom_width=1024, custom_height=1024):
        width, height = preset_dimensions(preset, custom_width, custom_height)
        return io.NodeOutput(_empty_latent(width, height, batch_size), width, height)
