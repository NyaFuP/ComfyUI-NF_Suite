import torch

from NF_Suite.nodes.independent_queue.preview import MAX_TEXT, describe


def test_string_is_shown_as_is():
    assert describe("a cat, masterpiece") == {"kind": "text", "text": "a cat, masterpiece"}


def test_empty_string():
    assert describe("") == {"kind": "text", "text": ""}


def test_numbers_and_bools():
    assert describe(42) == {"kind": "text", "text": "42"}
    assert describe(0.5) == {"kind": "text", "text": "0.5"}
    assert describe(True) == {"kind": "text", "text": "True"}


def test_none():
    assert describe(None) == {"kind": "text", "text": "None"}


def test_image_tensor_is_an_image():
    assert describe(torch.zeros(2, 8, 8, 3))["kind"] == "image"
    assert describe(torch.zeros(1, 8, 8, 4))["kind"] == "image"


def test_other_tensor_shows_shape_and_dtype():
    result = describe(torch.zeros(1, 8, 8))
    assert result == {"kind": "text", "text": "Tensor shape=(1, 8, 8) dtype=float32"}


def test_latent_dict_shows_samples_shape():
    result = describe({"samples": torch.zeros(1, 4, 16, 16)})
    assert result == {"kind": "text", "text": "LATENT samples shape=(1, 4, 16, 16)"}


def test_list_of_strings_joined_by_lines():
    assert describe(["a", "b"]) == {"kind": "text", "text": "a\nb"}


def test_other_objects_show_type_name():
    class Model:
        pass

    assert describe(Model()) == {"kind": "text", "text": "<Model>"}


def test_long_text_is_truncated():
    result = describe("x" * (MAX_TEXT + 10))
    assert len(result["text"]) == MAX_TEXT + len("\n… (truncated)")
    assert result["text"].endswith("… (truncated)")
