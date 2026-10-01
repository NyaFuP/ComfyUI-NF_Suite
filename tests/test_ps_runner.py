import pytest
import torch

from NF_Suite.core.errors import InvalidData, NotFound
from NF_Suite.nodes.preview_selector.runner import run_selector, run_source
from NF_Suite.nodes.preview_selector.store import BatchStore


@pytest.fixture
def store(tmp_path):
    return BatchStore(str(tmp_path / "b"))


def images(n):
    return torch.stack([torch.full((4, 6, 3), float(i)) for i in range(n)])


def fake_save_previews(imgs):
    return [{"filename": f"p{i}.png", "subfolder": "", "type": "temp"} for i in range(len(imgs))]


def test_review_mode_blocks_and_publishes_candidates(store):
    result = run_selector(images(3), None, "review_and_select", store, fake_save_previews)
    assert result["outputs"] is None  # caller turns this into ExecutionBlocker(None) x3
    assert [c["filename"] for c in result["ui"]["nf_candidates"]] == ["p0.png", "p1.png", "p2.png"]
    (batch_id,) = result["ui"]["nf_batch"]
    loaded, _ = store.load(batch_id)
    assert loaded.shape[0] == 3


@pytest.mark.parametrize("mode,expected", [("pass_through", "0,1,2"), ("take_first", "0"), ("take_last", "2")])
def test_automatic_modes_output_selection_and_still_publish_candidates(store, mode, expected):
    result = run_selector(images(3), None, mode, store, fake_save_previews)
    imgs, lats, indices = result["outputs"]
    assert indices == expected
    assert imgs.shape[0] == len(expected.split(","))
    assert lats is None
    assert len(result["ui"]["nf_candidates"]) == 3
    assert result["ui"]["nf_batch"]


def test_images_are_moved_to_cpu_before_storing(store):
    result = run_selector(images(1), {"samples": torch.zeros(1, 4, 2, 2)}, "review_and_select", store, fake_save_previews)
    loaded_imgs, loaded_lats = store.load(result["ui"]["nf_batch"][0])
    assert loaded_imgs.device.type == "cpu"
    assert loaded_lats["samples"].shape == (1, 4, 2, 2)


def test_source_outputs_the_selected_candidates(store):
    batch_id = store.save(images(4), {"samples": torch.stack([torch.full((4, 1, 1), float(i)) for i in range(4)])})
    imgs, lats, indices = run_source(store, batch_id, "3,1")
    assert indices == "1,3"
    assert [imgs[0, 0, 0, 0].item(), imgs[1, 0, 0, 0].item()] == [1.0, 3.0]
    assert lats["samples"][1, 0, 0, 0].item() == 3.0


def test_source_with_missing_batch(store):
    with pytest.raises(NotFound):
        run_source(store, "0" * 32, "0")


def test_source_with_bad_selection(store):
    batch_id = store.save(images(2), None)
    with pytest.raises(InvalidData):
        run_source(store, batch_id, "5")
