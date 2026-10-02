"""Variable expansion for prompt templates (pure functions, no ComfyUI imports).

Rules (see CLAUDE.md "変数展開ルール"):
- Only `{identifier}` is replaced. Anything else in braces is left untouched.
- Placeholders without a value are left as-is and reported as warnings.
- After substitution, separators (comma / period) left behind by empty values are cleaned up.
- Unbalanced brackets are reported as warnings, never as errors.
"""

import re

# `{name}` but not `{{name}}` (double braces are literal text).
# Keep in sync with PLACEHOLDER_RE in frontend/src/prompt_template/editorForm.ts.
PLACEHOLDER_RE = re.compile(r"(?<!\{)\{([A-Za-z_][A-Za-z0-9_]*)\}(?!\})")

# Variable replaced by the node's `text` input when it is connected.
# Keep in sync with INPUT_VAR in frontend/src/prompt_template/types.ts.
INPUT_VAR = "input"

# A run of 2+ separators, possibly with spaces/tabs between them.
_SEPARATOR_RUN_RE = re.compile(r"[,.](?:[ \t]*[,.])+")
_LEADING_SEPARATORS_RE = re.compile(r"^[ \t]*(?:[,.][ \t]*)+")
_TRAILING_COMMAS_RE = re.compile(r"(?:[ \t]*,)+[ \t]*$")
_MULTI_SPACE_RE = re.compile(r"[ \t]{2,}")
_SPACE_BEFORE_COMMA_RE = re.compile(r"[ \t]+,")
_SPACE_BEFORE_PERIOD_RE = re.compile(r"[ \t]+\.(?=\s|$)")

_OPENING = {"(": ")", "[": "]", "{": "}"}
_CLOSING = {v: k for k, v in _OPENING.items()}


def _warning(code, message, **extra):
    return {"code": code, "message": message, **extra}


def _substitute(text, values):
    """Replace placeholders in a single pass (values are never expanded again)."""
    return PLACEHOLDER_RE.sub(lambda m: values.get(m.group(1), m.group(0)), text)


def _undefined_warnings(text, values):
    undefined = dict.fromkeys(name for name in PLACEHOLDER_RE.findall(text) if name not in values)
    return [_warning("undefined_variable", f"Variable '{name}' is not defined", var=name) for name in undefined]


def _collapse_separator_run(match):
    return "." if "." in match.group(0) else ","


def _cleanup_line(line, keep_trailing_comma):
    line = _SEPARATOR_RUN_RE.sub(_collapse_separator_run, line)
    line = _LEADING_SEPARATORS_RE.sub("", line)
    if not keep_trailing_comma:
        line = _TRAILING_COMMAS_RE.sub("", line)
    line = _MULTI_SPACE_RE.sub(" ", line)
    line = _SPACE_BEFORE_COMMA_RE.sub(",", line)
    line = _SPACE_BEFORE_PERIOD_RE.sub(".", line)
    return line.strip(" \t")


def _expand_line(template_line, values):
    """Expand one template line (a value may add more lines). Returns the output lines.

    A comma the template line itself ends with is kept; one left at the end only because a
    value is empty is removed. Lines inside a multi-line value keep their own commas. A line
    that becomes empty only because its values are empty is dropped.
    """
    lines = _substitute(template_line, values).split("\n")
    ends_with_comma = template_line.rstrip(" \t").endswith(",")
    last = len(lines) - 1
    cleaned = [_cleanup_line(line, ends_with_comma if i == last else True) for i, line in enumerate(lines)]
    if template_line.strip() and not any(cleaned):
        return []
    return cleaned


def check_brackets(text):
    """Return a warning list (empty or one item) for unbalanced (), [], {}.

    Backslash-escaped brackets such as `\\(` are ignored.
    """
    stack = []
    escaped = False
    for ch in text:
        if escaped:
            escaped = False
            continue
        if ch == "\\":
            escaped = True
            continue
        if ch in _OPENING:
            stack.append(ch)
        elif ch in _CLOSING:
            if not stack or stack[-1] != _CLOSING[ch]:
                return [_warning("unbalanced_bracket", f"Unexpected '{ch}'")]
            stack.pop()
    if stack:
        return [_warning("unbalanced_bracket", f"Unclosed '{stack[-1]}'")]
    return []


def expand_text(text, values):
    """Expand one text. Returns (expanded_text, warnings)."""
    result = "\n".join(line for template_line in text.split("\n") for line in _expand_line(template_line, values))
    return result, _undefined_warnings(text, values) + check_brackets(result)


def expand_template(template, values, input_text=None):
    """Expand a template dict with node-provided values.

    Values come from the node; a variable missing from `values` falls back to the
    template default. Values for names the template does not define are ignored.
    `input_text` (the connected `text` input, or None) replaces `{input}` and wins over both.
    Returns {"positive", "negative", "warnings"}.
    """
    defaults = template.get("variables") or {}
    merged = {name: values.get(name, default) for name, default in defaults.items()}
    if input_text is not None:
        merged[INPUT_VAR] = input_text

    positive, pos_warnings = expand_text(template.get("template", ""), merged)
    negative, neg_warnings = expand_text(template.get("negative_prompt", ""), merged)

    warnings = [dict(w, field="positive") for w in pos_warnings]
    warnings += [dict(w, field="negative") for w in neg_warnings]

    used = set(PLACEHOLDER_RE.findall(template.get("template", "")))
    used |= set(PLACEHOLDER_RE.findall(template.get("negative_prompt", "")))
    connected = input_text is not None
    warnings += [
        _warning("unused_variable", f"Variable '{name}' is not used", var=name)
        for name in defaults
        if name not in used and not (connected and name == INPUT_VAR)
    ]
    if connected and INPUT_VAR not in used:
        warnings.append(_warning("input_unused", "The connected text is not used: the template has no {input}"))
    return {"positive": positive, "negative": negative, "warnings": warnings}
