"""Candidate batches kept between the generate run and the [Continue] run.

Each batch (images and optional latents, on CPU) is saved as `<dir>/<batch_id>.pt`.
The directory lives under ComfyUI's temp folder, which ComfyUI empties on startup.
Only the newest `max_batches` files are kept.

batch_id = 20-digit monotonic nanosecond counter + 12 random hex chars, so file names
sort by age (file mtimes are too coarse on Windows to order quick successive saves).
"""

import os
import re
import threading
import time
import uuid

import torch

from ...core.errors import NotFound

_ID_RE = re.compile(r"^[0-9a-f]{32}$")


class BatchStore:
    def __init__(self, directory, max_batches=20):
        self.directory = directory
        self.max_batches = max_batches
        self._lock = threading.Lock()
        self._last_ns = 0

    def _new_id(self):
        with self._lock:
            self._last_ns = max(time.time_ns(), self._last_ns + 1)
            return f"{self._last_ns:020d}{uuid.uuid4().hex[:12]}"

    def _path(self, batch_id):
        if not isinstance(batch_id, str) or not _ID_RE.match(batch_id):
            raise self._not_found(batch_id)
        return os.path.join(self.directory, f"{batch_id}.pt")

    @staticmethod
    def _not_found(batch_id):
        return NotFound(
            "The candidate images are no longer available (ComfyUI was restarted or they were cleaned up). "
            "Generate again.",
            code="BATCH_NOT_FOUND",
            details={"batch_id": batch_id},
        )

    def save(self, images, latents):
        os.makedirs(self.directory, exist_ok=True)
        batch_id = self._new_id()
        data = {"images": images.detach().cpu()}
        if latents is not None:
            data["latents"] = latents["samples"].detach().cpu()
        torch.save(data, self._path(batch_id))
        self._prune()
        return batch_id

    def load(self, batch_id):
        path = self._path(batch_id)
        if not os.path.exists(path):
            raise self._not_found(batch_id)
        data = torch.load(path, map_location="cpu", weights_only=True)
        latents = {"samples": data["latents"]} if "latents" in data else None
        return data["images"], latents

    def _prune(self):
        names = sorted(f for f in os.listdir(self.directory) if f.endswith(".pt"))
        for name in names[: max(0, len(names) - self.max_batches)]:
            try:
                os.remove(os.path.join(self.directory, name))
            except OSError:
                pass
