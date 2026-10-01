"""Where NF_Suite stores its data (depends on ComfyUI's folder_paths)."""

import os

import folder_paths

PACKAGE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEMPLATE_DIR_ENV = "NF_PROMPT_TEMPLATE_DIR"
TEMPLATE_FILE_NAME = "templates.json"
TEMPLATE_SEED_PATH = os.path.join(PACKAGE_DIR, "examples", "templates.example.json")


def get_template_dir():
    """$NF_PROMPT_TEMPLATE_DIR, or ComfyUI's system user dir `user/__nf_prompt_template`.

    System user dirs (prefixed with '__') are not reachable through the /userdata HTTP API,
    so only our own routes read and write the library.
    """
    override = os.environ.get(TEMPLATE_DIR_ENV, "").strip()
    if override:
        return os.path.abspath(os.path.expanduser(override))
    return folder_paths.get_system_user_directory("nf_prompt_template")


def get_template_path():
    return os.path.join(get_template_dir(), TEMPLATE_FILE_NAME)


def get_preview_batch_dir():
    """Candidate batches of NF Preview Selector. ComfyUI empties the temp folder on startup."""
    return os.path.join(folder_paths.get_temp_directory(), "nf_preview_selector")
