"""How NF Independent Queue shows the value it received (pure, no ComfyUI imports).

describe(value) -> {"kind": "image"} for IMAGE tensors (the node saves a preview),
otherwise {"kind": "text", "text": ...}.
"""

MAX_TEXT = 20000
_TRUNCATED = "\n… (truncated)"


def _is_tensor(value):
    return hasattr(value, "shape") and hasattr(value, "dtype")


def _dtype_name(value):
    return str(value.dtype).replace("torch.", "")


def _shape(value):
    return tuple(int(n) for n in value.shape)


def _is_image(value):
    # ComfyUI IMAGE: [batch, height, width, channels] with 3 (RGB) or 4 (RGBA) channels
    return _is_tensor(value) and len(value.shape) == 4 and value.shape[-1] in (3, 4)


def _truncate(text):
    return text if len(text) <= MAX_TEXT else text[:MAX_TEXT] + _TRUNCATED


def _to_text(value):
    if value is None or isinstance(value, (str, int, float, bool)):
        return str(value)
    if _is_tensor(value):
        return f"Tensor shape={_shape(value)} dtype={_dtype_name(value)}"
    if isinstance(value, dict) and _is_tensor(value.get("samples")):
        return f"LATENT samples shape={_shape(value['samples'])}"
    if isinstance(value, (list, tuple)) and all(isinstance(v, str) for v in value):
        return "\n".join(value)
    return f"<{type(value).__name__}>"


def describe(value):
    if _is_image(value):
        return {"kind": "image"}
    return {"kind": "text", "text": _truncate(_to_text(value))}
