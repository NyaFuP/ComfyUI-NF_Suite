"""A single JSON document on disk with atomic writes and optimistic concurrency.

- The file is re-read on every access, so external edits (text editor, git) are picked up.
- `revision` is a hash of the file bytes. Writers pass the revision they based their
  change on; a mismatch raises Conflict instead of silently overwriting.
- A file that cannot be parsed or validated raises StorageCorrupt and is never overwritten.
- Writes go to a temp file in the same directory and are moved into place with os.replace.
"""

import hashlib
import json
import logging
import os
import tempfile
import threading
import time

from .errors import Conflict, InvalidData, StorageCorrupt

logger = logging.getLogger(__name__)

_REPLACE_RETRIES = 5
_REPLACE_RETRY_DELAY = 0.05


def _revision_of(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()[:16]


class JsonDocumentStore:
    def __init__(self, path, initial, validator, corrupt_code="STORAGE_CORRUPT"):
        """
        path:      file path of the JSON document
        initial:   callable returning the document to create when the file is missing
        validator: callable(doc) -> normalized doc, raising InvalidData when invalid
        """
        self.path = os.path.abspath(path)
        self._initial = initial
        self._validator = validator
        self._corrupt_code = corrupt_code
        self._lock = threading.Lock()

    # --- public -----------------------------------------------------------

    def read(self):
        """Return (document, revision)."""
        with self._lock:
            return self._read_locked()

    def update(self, change, base_revision):
        """Apply change(doc) -> new_doc if the file still has `base_revision`.

        Returns (new_document, new_revision).
        """
        with self._lock:
            doc, revision = self._read_locked()
            if base_revision != revision:
                raise Conflict(
                    "The file was changed by someone else. Reload and try again.",
                    details={"revision": revision},
                )
            new_doc = self._validator(change(doc))
            new_revision = self._write_locked(new_doc)
            return new_doc, new_revision

    # --- internals --------------------------------------------------------

    def _read_locked(self):
        if not os.path.exists(self.path):
            doc = self._validator(self._initial())
            return doc, self._write_locked(doc)

        with open(self.path, "rb") as f:
            raw = f.read()
        try:
            data = json.loads(raw.decode("utf-8-sig"))
        # The message reaches HTTP clients, so the path and parser details only go to the server log.
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            logger.error("[NF_Suite] Cannot parse %s: %s", self.path, e)
            raise StorageCorrupt(
                "The stored file is not valid JSON. See the ComfyUI log for details.", code=self._corrupt_code
            ) from e
        try:
            doc = self._validator(data)
        except InvalidData as e:
            logger.error("[NF_Suite] Invalid content in %s: %s", self.path, e.message)
            raise StorageCorrupt(
                f"The stored file has invalid content: {e.message}",
                code=self._corrupt_code,
                details={"reason": e.to_dict()["error"]},
            ) from e
        return doc, _revision_of(raw)

    def _write_locked(self, doc):
        raw = (json.dumps(doc, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        directory = os.path.dirname(self.path)
        os.makedirs(directory, exist_ok=True)

        fd, tmp_path = tempfile.mkstemp(prefix=".tmp-", suffix=".json", dir=directory)
        try:
            with os.fdopen(fd, "wb") as f:
                f.write(raw)
                f.flush()
                os.fsync(f.fileno())
            self._replace(tmp_path)
        except BaseException:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            raise
        return _revision_of(raw)

    def _replace(self, tmp_path):
        # On Windows os.replace can fail briefly while another process (editor,
        # antivirus) holds the target open.
        for attempt in range(_REPLACE_RETRIES):
            try:
                os.replace(tmp_path, self.path)
                return
            except PermissionError:
                if attempt == _REPLACE_RETRIES - 1:
                    raise
                time.sleep(_REPLACE_RETRY_DELAY)
