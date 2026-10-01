import os

import pytest
import torch

from NF_Suite.core.errors import NotFound
from NF_Suite.nodes.preview_selector.store import BatchStore


@pytest.fixture
def store(tmp_path):
    return BatchStore(str(tmp_path / "batches"), max_batches=3)


def test_save_and_load_round_trip(store):
    imgs = torch.rand(2, 8, 8, 3)
    lats = {"samples": torch.rand(2, 4, 1, 1)}
    batch_id = store.save(imgs, lats)
    loaded_imgs, loaded_lats = store.load(batch_id)
    assert torch.equal(loaded_imgs, imgs)
    assert torch.equal(loaded_lats["samples"], lats["samples"])


def test_save_without_latents(store):
    batch_id = store.save(torch.rand(1, 4, 4, 3), None)
    assert store.load(batch_id)[1] is None


def test_ids_are_unique_hex(store):
    a = store.save(torch.rand(1, 2, 2, 3), None)
    b = store.save(torch.rand(1, 2, 2, 3), None)
    assert a != b
    assert all(c in "0123456789abcdef" for c in a)


def test_tensors_are_stored_on_cpu(store):
    batch_id = store.save(torch.rand(1, 2, 2, 3), None)
    assert store.load(batch_id)[0].device.type == "cpu"


@pytest.mark.parametrize("bad_id", ["missing", "../etc", "", "a/b"])
def test_unknown_or_unsafe_id_is_not_found(store, bad_id):
    with pytest.raises(NotFound) as exc:
        store.load(bad_id)
    assert exc.value.code == "BATCH_NOT_FOUND"


def test_old_batches_are_pruned(store, tmp_path):
    ids = [store.save(torch.rand(1, 2, 2, 3), None) for _ in range(5)]
    assert len(os.listdir(tmp_path / "batches")) == 3
    with pytest.raises(NotFound):
        store.load(ids[0])
    store.load(ids[-1])
