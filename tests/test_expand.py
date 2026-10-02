from NF_Suite.nodes.prompt_template.expand import expand_template, expand_text


def codes(warnings):
    return [w["code"] for w in warnings]


# --- substitution -----------------------------------------------------------

def test_replaces_identifier_placeholders():
    text, warnings = expand_text("{quality}, {character}", {"quality": "best", "character": "girl"})
    assert text == "best, girl"
    assert warnings == []


def test_leaves_non_identifier_braces_untouched():
    text, _ = expand_text("{red|blue} hair, {{literal}}, { spaced }", {})
    assert text == "{red|blue} hair, {{literal}}, { spaced }"


def test_double_braces_are_not_placeholders_even_if_defined():
    text, warnings = expand_text("{{a}} {a}", {"a": "x"})
    assert text == "{{a}} x"
    assert warnings == []


def test_double_braces_do_not_warn_as_undefined():
    _, warnings = expand_text("{{literal}}", {})
    assert warnings == []


def test_double_brace_placeholders_are_not_counted_as_used():
    tpl = {"template": "{{a}}", "negative_prompt": "", "variables": {"a": "x"}}
    assert [w["code"] for w in expand_template(tpl, {})["warnings"]] == ["unused_variable"]


def test_undefined_variable_is_left_as_is_with_warning():
    text, warnings = expand_text("{quality}, {missing}", {"quality": "best"})
    assert text == "best, {missing}"
    assert codes(warnings) == ["undefined_variable"]
    assert warnings[0]["var"] == "missing"


def test_undefined_variable_warned_once_even_if_repeated():
    _, warnings = expand_text("{x} {x}", {})
    assert codes(warnings) == ["undefined_variable"]


def test_empty_value_is_substituted_as_empty_string():
    text, _ = expand_text("a {v} b", {"v": ""})
    assert text == "a b"


def test_value_containing_braces_is_not_expanded_again():
    text, _ = expand_text("{a}", {"a": "{b}", "b": "x"})
    assert text == "{b}"


# --- separator cleanup ------------------------------------------------------

def test_collapses_repeated_commas_left_by_empty_variable():
    text, _ = expand_text("{a}, {b}, {c}", {"a": "x", "b": "", "c": "z"})
    assert text == "x, z"


def test_collapses_repeated_periods():
    text, _ = expand_text("{a}. {b}. {c}", {"a": "x", "b": "", "c": "z"})
    assert text == "x. z"


def test_collapses_mixed_separators_period_wins():
    assert expand_text("x,. z", {})[0] == "x. z"
    assert expand_text("x. , z", {})[0] == "x. z"


def test_removes_leading_separators():
    text, _ = expand_text("{a}, {b}", {"a": "", "b": "y"})
    assert text == "y"


def test_removes_trailing_comma_but_keeps_trailing_period():
    assert expand_text("{a}, {b}", {"a": "x", "b": ""})[0] == "x"
    assert expand_text("A cat sits.", {})[0] == "A cat sits."


def test_sentence_ending_with_empty_variable():
    text, _ = expand_text("{a}, {b}.", {"a": "x", "b": ""})
    assert text == "x."


def test_decimal_numbers_and_weights_are_preserved():
    text, _ = expand_text("(masterpiece:1.2), weight 0.5", {})
    assert text == "(masterpiece:1.2), weight 0.5"


def test_collapses_spaces_and_removes_space_before_comma():
    text, _ = expand_text("{a} {b} , c", {"a": "x", "b": ""})
    assert text == "x, c"


def test_cleanup_is_applied_per_line():
    text, _ = expand_text("{a}, b\n, c,\n{d}", {"a": "", "d": ""})
    assert text == "b\nc\n"


# --- bracket check ----------------------------------------------------------

def test_warns_on_unclosed_bracket():
    _, warnings = expand_text("(masterpiece, [best", {})
    assert codes(warnings) == ["unbalanced_bracket"]


def test_warns_on_mismatched_bracket():
    _, warnings = expand_text("(a]", {})
    assert codes(warnings) == ["unbalanced_bracket"]


def test_escaped_brackets_are_ignored():
    _, warnings = expand_text(r"\(artist\) name", {})
    assert warnings == []


def test_balanced_brackets_have_no_warning():
    _, warnings = expand_text("((a), [b], {c|d})", {})
    assert warnings == []


# --- whole template ---------------------------------------------------------

TEMPLATE = {
    "id": "fantasy_01",
    "name": "Fantasy Scene",
    "category": "Scene",
    "template": "{quality}, {character}, {location}",
    "negative_prompt": "low quality, {neg_extra}",
    "variables": {
        "quality": "masterpiece",
        "character": "",
        "location": "forest",
        "neg_extra": "blurry",
        "unused": "x",
    },
}


def test_expand_template_uses_node_values_over_defaults():
    result = expand_template(TEMPLATE, {"character": "knight", "location": "castle"})
    assert result["positive"] == "masterpiece, knight, castle"


def test_expand_template_uses_default_when_value_missing():
    result = expand_template(TEMPLATE, {})
    assert result["positive"] == "masterpiece, forest"
    assert result["negative"] == "low quality, blurry"


def test_expand_template_empty_value_overrides_default():
    result = expand_template(TEMPLATE, {"quality": ""})
    assert result["positive"] == "forest"


def test_expand_template_warns_unused_variables():
    result = expand_template(TEMPLATE, {})
    assert {"code": "unused_variable", "var": "unused"}.items() <= result["warnings"][0].items()
    assert codes(result["warnings"]) == ["unused_variable"]


def test_expand_template_tags_warnings_with_field():
    tpl = dict(TEMPLATE, template="({quality}", variables={"quality": "q"}, negative_prompt="")
    result = expand_template(tpl, {})
    assert result["warnings"][0]["field"] == "positive"


def test_expand_template_ignores_values_for_unknown_variables():
    result = expand_template(TEMPLATE, {"not_defined": "zzz"})
    assert "zzz" not in result["positive"]


# --- connected `text` input ({input}) ---------------------------------------

def test_input_text_replaces_input_placeholder():
    tpl = dict(TEMPLATE, template="{quality}, {input}", negative_prompt="", variables={"quality": "q"})
    result = expand_template(tpl, {}, input_text="a knight")
    assert result["positive"] == "q, a knight"
    assert codes(result["warnings"]) == []


def test_input_text_wins_over_default_and_node_value():
    tpl = dict(TEMPLATE, template="{input}", negative_prompt="", variables={"input": "default"})
    assert expand_template(tpl, {"input": "node"}, input_text="linked")["positive"] == "linked"


def test_without_input_text_input_is_an_ordinary_variable():
    tpl = dict(TEMPLATE, template="{input}", negative_prompt="", variables={"input": "default"})
    assert expand_template(tpl, {})["positive"] == "default"
    undefined = dict(tpl, variables={})
    assert codes(expand_template(undefined, {})["warnings"]) == ["undefined_variable"]


def test_empty_input_text_is_cleaned_up_like_an_empty_variable():
    tpl = dict(TEMPLATE, template="{input}, forest", negative_prompt="", variables={})
    assert expand_template(tpl, {}, input_text="")["positive"] == "forest"


def test_input_text_containing_braces_is_not_expanded_again():
    tpl = dict(TEMPLATE, template="{input}", negative_prompt="", variables={"quality": "q"})
    result = expand_template(tpl, {}, input_text="{quality}")
    assert result["positive"] == "{quality}"


def test_warns_when_connected_text_is_not_used():
    tpl = dict(TEMPLATE, template="{quality}", negative_prompt="", variables={"quality": "q", "input": ""})
    result = expand_template(tpl, {}, input_text="a knight")
    assert codes(result["warnings"]) == ["input_unused"]
