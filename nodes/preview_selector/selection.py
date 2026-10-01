"""Selection helpers for NF Preview Selector (no ComfyUI imports)."""

from ...core.errors import InvalidData

MODES = ["review_and_select", "pass_through", "take_first", "take_last"]


def _invalid(message):
    return InvalidData(message, code="INVALID_SELECTION")


def parse_selection(raw, count):
    """'2,0' -> [0, 2]. Every index must be within the batch; at least one is required."""
    tokens = [t.strip() for t in (raw or "").split(",") if t.strip()]
    if not tokens:
        raise _invalid("No image selected")
    indices = set()
    for token in tokens:
        if not token.isdigit():
            raise _invalid(f"Invalid image index '{token}'")
        index = int(token)
        if index >= count:
            raise _invalid(f"Image index {index} is out of range (batch has {count} images)")
        indices.add(index)
    return sorted(indices)


def indices_for_mode(mode, count):
    """Automatic selection for the non-interactive modes."""
    if mode == "pass_through":
        return list(range(count))
    if mode == "take_first":
        return [0] if count else []
    if mode == "take_last":
        return [count - 1] if count else []
    raise ValueError(f"Mode '{mode}' has no automatic selection")


def format_indices(indices):
    return ",".join(str(i) for i in indices)


def pick(images, latents, indices):
    """Return (images, latents, "i,j") for the given indices. Inputs are not modified."""
    selected_images = images[list(indices)].clone()
    selected_latents = None
    if latents is not None:
        selected_latents = {"samples": latents["samples"][list(indices)].clone()}
    return selected_images, selected_latents, format_indices(indices)
