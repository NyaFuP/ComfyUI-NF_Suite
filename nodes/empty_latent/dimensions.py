"""Size calculation for the NF Empty Latent nodes (pure; behaviour kept from NF_Tools).

The option lists are part of saved workflows (combo values), so keep names and order.
"""

ASPECT_RATIOS = {
    "1:1": (1, 1),       # Square
    "5:4": (5, 4),       # Classic
    "4:3": (4, 3),       # Standard
    "3:2": (3, 2),       # Photo
    "16:9": (16, 9),     # Widescreen
    "21:9": (21, 9),     # Ultra-wide
    "4:5": (4, 5),       # Classic portrait
    "3:4": (3, 4),       # Portrait photo
    "2:3": (2, 3),       # Portrait
    "9:16": (9, 16),     # Vertical video
}

ORIENTATIONS = ["auto", "portrait", "landscape"]

PRESETS = {
    "SD 1.5 (512x512)": (512, 512),
    "SD 1.5 Portrait (512x768)": (512, 768),
    "SD 1.5 Landscape (768x512)": (768, 512),
    "SDXL (1024x1024)": (1024, 1024),
    "SDXL Portrait (832x1216)": (832, 1216),
    "SDXL Landscape (1216x832)": (1216, 832),
    "HD (1280x720)": (1280, 720),
    "Full HD (1920x1080)": (1920, 1080),
    "4K (3840x2160)": (3840, 2160),
    "Instagram Square (1080x1080)": (1080, 1080),
    "Instagram Portrait (1080x1350)": (1080, 1350),
    "Custom": (1024, 1024),
}

MIN_SIZE = 64


def round_to_multiple_of_64(value):
    return ((value + 32) // 64) * 64


def aspect_dimensions(long_side, aspect_ratio, orientation, force_multiple_of_64):
    """(width, height) in pixels from the long side, an aspect ratio and an orientation."""
    aspect_w, aspect_h = ASPECT_RATIOS[aspect_ratio]
    if aspect_w >= aspect_h:
        width, height = long_side, int(long_side * aspect_h / aspect_w)
    else:
        width, height = int(long_side * aspect_w / aspect_h), long_side

    if orientation == "portrait" and width > height:
        width, height = height, width
    elif orientation == "landscape" and width < height:
        width, height = height, width

    if force_multiple_of_64:
        width, height = round_to_multiple_of_64(width), round_to_multiple_of_64(height)
    return max(MIN_SIZE, width), max(MIN_SIZE, height)


def preset_dimensions(preset, custom_width, custom_height):
    if preset == "Custom":
        return custom_width, custom_height
    return PRESETS[preset]
