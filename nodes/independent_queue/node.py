"""NF Independent Queue.

NF_IndependentQueue is what users place in the graph. It is NOT an output node and has
no outputs, so a normal Run never executes it (it is upstream of no output).

The frontend's [Run] button queues the workflow with this node's class_type swapped to
NF_IndependentQueueRun (an output node, hidden from menus) and targets it with
partial_execution_targets, so only its upstream branch runs. The node id stays the same,
so the host shows images / executing state on the original node.
"""

from comfy_api.latest import io, ui

from .preview import describe

SEED_MODES = ["randomize", "follow", "off"]


def _inputs():
    return [
        io.AnyType.Input("value", tooltip="Anything; the result is shown in this node when you press Run."),
        io.Combo.Input(
            "seed_mode",
            options=SEED_MODES,
            default="randomize",
            tooltip=(
                "Before each Run: randomize = new random value for every upstream seed that has a "
                "control_after_generate; follow = apply each seed's own control setting; off = keep seeds."
            ),
        ),
    ]


class IndependentQueue(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NF_IndependentQueue",
            display_name="NF Independent Queue",
            category="NF Suite/queue",
            description="Run only the upstream branch of this node with its own Run button and show the result here.",
            inputs=_inputs(),
            outputs=[],
            search_aliases=["run branch", "partial run", "preview", "independent"],
        )

    @classmethod
    def execute(cls, value, seed_mode):
        # Only reachable if someone targets this node directly; the Run variant does the work.
        return io.NodeOutput()


class IndependentQueueRun(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NF_IndependentQueueRun",
            display_name="NF Independent Queue (run)",
            category="NF Suite/queue",
            description="Internal: output-node variant queued by NF Independent Queue's Run button.",
            inputs=_inputs(),
            outputs=[],
            is_output_node=True,
            is_dev_only=True,
        )

    @classmethod
    def execute(cls, value, seed_mode):
        shown = describe(value)
        if shown["kind"] == "image":
            return io.NodeOutput(ui=ui.PreviewImage(value, cls=cls))
        return io.NodeOutput(ui=ui.PreviewText(shown["text"]))
