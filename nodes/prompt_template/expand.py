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
    undefined = []

    def repl(match):
        name = match.group(1)
        if name in values:
            return values[name]
        if name not in undefined:
            undefined.append(name)
        return match.group(0)

    result = PLACEHOLDER_RE.sub(repl, text)
    warnings = [
        _warning("undefined_variable", f"Variable '{name}' is not defined", var=name)
        for name in undefined
    ]
    return result, warnings


def _collapse_separator_run(match):
    return "." if "." in match.group(0) else ","


def _cleanup_line(line):
    line = _SEPARATOR_RUN_RE.sub(_collapse_separator_run, line)
    line = _LEADING_SEPARATORS_RE.sub("", line)
    line = _TRAILING_COMMAS_RE.sub("", line)
    line = _MULTI_SPACE_RE.sub(" ", line)
    line = _SPACE_BEFORE_COMMA_RE.sub(",", line)
    line = _SPACE_BEFORE_PERIOD_RE.sub(".", line)
    return line.strip(" \t")


def cleanup_separators(text):
    return "\n".join(_cleanup_line(line) for line in text.split("\n"))


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
    result, warnings = _substitute(text, values)
    result = cleanup_separators(result)
    warnings += check_brackets(result)
    return result, warnings


def expand_template(template, values):
    """Expand a template dict with node-provided values.

    Values come from the node; a variable missing from `values` falls back to the
    template default. Values for names the template does not define are ignored.
    Returns {"positive", "negative", "warnings"}.
    """
    defaults = template.get("variables") or {}
    merged = {name: values.get(name, default) for name, default in defaults.items()}

    positive, pos_warnings = expand_text(template.get("template", ""), merged)
    negative, neg_warnings = expand_text(template.get("negative_prompt", ""), merged)

    warnings = [dict(w, field="positive") for w in pos_warnings]
    warnings += [dict(w, field="negative") for w in neg_warnings]

    used = set(PLACEHOLDER_RE.findall(template.get("template", "")))
    used |= set(PLACEHOLDER_RE.findall(template.get("negative_prompt", "")))
    warnings += [
        _warning("unused_variable", f"Variable '{name}' is not used", var=name)
        for name in defaults
        if name not in used
    ]
    return {"positive": positive, "negative": negative, "warnings": warnings}
