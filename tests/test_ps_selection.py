import pytest
import torch

from NF_Suite.core.errors import InvalidData
from NF_Suite.nodes.preview_selector.selection import format_indices, indices_for_mode, parse_selection, pick


def images(n):
    # distinguishable images: image i is filled with value i
    return torch.stack([torch.full((4, 6, 3), float(i)) for i in range(n)])


def latents(n):
    return {"samples": torch.stack([torch.full((4, 2, 2), float(i)) for i in range(n)])}


# --- parse_selection -----------------------------------------------------------

def test_parse_selection_sorts_and_dedupes():
    assert parse_selection("2, 0,2", 3) == [0, 2]


@pytest.mark.parametrize("raw", ["", "  ", "a", "1,x", "-1", "3", "1.5"])
def test_parse_selection_rejects_bad_input(raw):
    with pytest.raises(InvalidData) as exc:
        parse_selection(raw, 3)
    assert exc.value.code == "INVALID_SELECTION"


# --- modes ------------------------------------------------------------------------

def test_indices_for_modes():
    assert indices_for_mode("pass_through", 3) == [0, 1, 2]
    assert indices_for_mode("take_first", 3) == [0]
    assert indices_for_mode("take_last", 3) == [2]


def test_indices_for_modes_with_no_images():
    assert indices_for_mode("take_first", 0) == []
    assert indices_for_mode("take_last", 0) == []


def test_review_mode_has_no_automatic_indices():
    with pytest.raises(ValueError):
        indices_for_mode("review_and_select", 3)


# --- pick -----------------------------------------------------------------------------

def test_pick_selects_images_and_latents_in_order():
    imgs, lats, indices = pick(images(4), latents(4), [1, 3])
    assert imgs.shape == (2, 4, 6, 3)
    assert imgs[0, 0, 0, 0].item() == 1.0 and imgs[1, 0, 0, 0].item() == 3.0
    assert lats["samples"].shape == (2, 4, 2, 2)
    assert lats["samples"][1, 0, 0, 0].item() == 3.0
    assert indices == "1,3"


def test_pick_without_latents():
    imgs, lats, _ = pick(images(2), None, [0])
    assert imgs.shape[0] == 1
    assert lats is None


def test_pick_does_not_modify_inputs():
    src = images(2)
    imgs, _, _ = pick(src, None, [0])
    imgs += 10
    assert src[0, 0, 0, 0].item() == 0.0


def test_format_indices():
    assert format_indices([0, 2, 5]) == "0,2,5"
