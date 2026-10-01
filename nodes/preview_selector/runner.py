"""What NF Preview Selector does, without ComfyUI imports.

run_selector: the graph node. Stores the candidate batch, publishes previews, and either
              blocks downstream (review_and_select) or outputs an automatic selection.
run_source:   the [Continue] variant. Loads a stored batch and outputs the chosen images.
"""

from .selection import indices_for_mode, parse_selection, pick


def run_selector(images, latents, mode, store, save_previews):
    """
    save_previews: callable(images) -> list of {"filename", "subfolder", "type"}
    Returns {"outputs": (images, latents, indices) or None to block, "ui": {...}}.
    """
    images = images.detach().cpu()
    if latents is not None:
        latents = {**latents, "samples": latents["samples"].detach().cpu()}

    batch_id = store.save(images, latents)
    # Not "images": the host would add its own image preview under our gallery.
    ui = {"nf_candidates": save_previews(images), "nf_batch": [batch_id]}

    if mode == "review_and_select":
        return {"outputs": None, "ui": ui}
    return {"outputs": pick(images, latents, indices_for_mode(mode, images.shape[0])), "ui": ui}


def run_source(store, batch_id, selection):
    images, latents = store.load(batch_id)
    return pick(images, latents, parse_selection(selection, images.shape[0]))
