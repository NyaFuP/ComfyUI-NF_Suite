import os
import sys

# Make `NF_Suite` importable as a package (tests import NF_Suite.core, NF_Suite.nodes...).
# NF_Suite/__init__.py must not import ComfyUI modules at import time for this to work.
CUSTOM_NODES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if CUSTOM_NODES_DIR not in sys.path:
    sys.path.insert(0, CUSTOM_NODES_DIR)
