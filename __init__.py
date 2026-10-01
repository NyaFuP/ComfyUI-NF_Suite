"""NF_Suite: NyaFu custom node suite for ComfyUI.

ComfyUI-dependent imports are done lazily inside comfy_entrypoint so that the
pure-Python parts (core/, nodes/*/expand.py, ...) can be tested with pytest
without starting ComfyUI.
"""

WEB_DIRECTORY = "./web"


async def comfy_entrypoint():
    from .comfy_glue.extension import NFSuiteExtension

    return NFSuiteExtension()


__all__ = ["WEB_DIRECTORY", "comfy_entrypoint"]
