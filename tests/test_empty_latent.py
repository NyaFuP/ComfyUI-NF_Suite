"""Behaviour carried over unchanged from NF_Tools/nf_empty_latent_image.py."""

import pytest

from NF_Suite.nodes.empty_latent.dimensions import (
    ASPECT_RATIOS,
    PRESETS,
    aspect_dimensions,
    preset_dimensions,
    round_to_multiple_of_64,
)


@pytest.mark.parametrize(
    "long_side,ratio,orientation,force64,expected",
    [
        (1024, "1:1", "auto", True, (1024, 1024)),
        (1024, "16:9", "auto", False, (1024, 576)),
        (1024, "16:9", "auto", True, (1024, 576)),
        (1024, "2:3", "auto", False, (682, 1024)),
        (1024, "2:3", "auto", True, (704, 1024)),     # 682 -> nearest multiple of 64
        (1024, "16:9", "portrait", True, (576, 1024)),
        (1024, "2:3", "landscape", True, (1024, 704)),
        (1024, "2:3", "portrait", True, (704, 1024)),  # already portrait
        (1024, "21:9", "auto", False, (1024, 438)),
        (64, "21:9", "auto", False, (64, 64)),         # minimum 64
    ],
)
def test_aspect_dimensions(long_side, ratio, orientation, force64, expected):
    assert aspect_dimensions(long_side, ratio, orientation, force64) == expected


def test_aspect_ratio_options_and_order():
    assert list(ASPECT_RATIOS) == ["1:1", "5:4", "4:3", "3:2", "16:9", "21:9", "4:5", "3:4", "2:3", "9:16"]


@pytest.mark.parametrize("value,expected", [(95, 64), (96, 128), (682, 704), (576, 576)])
def test_round_to_multiple_of_64(value, expected):
    # (value + 32) // 64 * 64: exactly halfway rounds up
    assert round_to_multiple_of_64(value) == expected


def test_preset_dimensions():
    assert preset_dimensions("SDXL Portrait (832x1216)", 1, 1) == (832, 1216)
    assert preset_dimensions("Custom", 640, 960) == (640, 960)


def test_preset_options_and_order():
    assert list(PRESETS)[0] == "SD 1.5 (512x512)"
    assert list(PRESETS)[-1] == "Custom"
    assert len(PRESETS) == 12
