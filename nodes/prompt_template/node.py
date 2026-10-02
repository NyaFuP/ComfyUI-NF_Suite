"""NF Prompt Template node (V3). Thin wrapper; the logic lives in runner.py."""

import logging

from comfy_api.latest import io

from ...comfy_glue.services import lookup_template
from ...core.errors import NFError
from . import runner

logger = logging.getLogger(__name__)


class PromptTemplate(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NF_PromptTemplate",
            display_name="NF Prompt Template",
            category="NF Suite/prompt",
            description="Select a template from the NF prompt template library and expand its variables.",
            inputs=[
                io.String.Input("template_id", default="", tooltip="Template id in the library"),
                io.String.Input(
                    "variables", default="{}", multiline=True,
                    tooltip="JSON object of variable values. Missing keys use the template defaults.",
                ),
                io.String.Input(
                    "snapshot", default="", multiline=True,
                    tooltip="Template content captured at queue time (JSON). Used when the template is missing or pinned.",
                ),
                io.Boolean.Input("pin_snapshot", default=False, tooltip="Always use the snapshot instead of the library"),
                io.String.Input(
                    "text", optional=True, force_input=True,
                    tooltip="Optional text from another node. Replaces {input} in the template.",
                ),
            ],
            outputs=[
                io.String.Output("positive", display_name="positive"),
                io.String.Output("negative", display_name="negative"),
            ],
            hidden=[io.Hidden.unique_id],
            search_aliases=["prompt template", "template"],
        )

    @classmethod
    def validate_inputs(cls, template_id, variables, snapshot, pin_snapshot):
        return runner.validate(lookup_template, template_id, variables, snapshot, pin_snapshot)

    @classmethod
    def fingerprint_inputs(cls, template_id, variables, snapshot, pin_snapshot):
        return runner.fingerprint(lookup_template, template_id, variables, snapshot, pin_snapshot)

    @classmethod
    def execute(cls, template_id, variables, snapshot, pin_snapshot, text=None):
        try:
            result = runner.run(lookup_template, template_id, variables, snapshot, pin_snapshot, text)
        except NFError as e:
            raise RuntimeError(f"[NF Prompt Template] [{e.code}] {e.message}") from e
        for w in result["warnings"]:
            logger.warning("[NF Prompt Template] node %s: %s", cls.hidden.unique_id, w["message"])
        return io.NodeOutput(result["positive"], result["negative"])
