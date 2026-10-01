# ComfyUI-NF_Suite

English | [日本語](README.ja.md)

A set of custom nodes for ComfyUI. You can find them under the **NF Suite** category of the "Add Node" menu.

| Node | Category | Summary |
|---|---|---|
| NF Prompt Template | NF Suite/prompt | Pick a template and fill in its variables to build a prompt |
| NF Independent Queue | NF Suite/queue | Run only this node's upstream branch with its own Run button and show the result on the node |
| NF Preview Selector | NF Suite/image | Show generated images as a gallery and continue the downstream part with only the ones you pick |
| NF Empty Latent Image | NF Suite/latent | Empty latent from a long side, an aspect ratio and an orientation |
| NF Preset Empty Latent Image | NF Suite/latent | Empty latent from a common size preset |

## Requirements

- ComfyUI 0.22.0 or later (V3 node API)
- ComfyUI Frontend 1.44.19 or later
- Works with both Nodes 2.0 (Vue nodes) and the classic LiteGraph renderer

## Installation

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/NyaFuP/ComfyUI-NF_Suite.git
```

Restart ComfyUI. No extra Python packages are needed. The built frontend (`web/`) is included, so Node.js is not needed either.

## Nodes

### NF Prompt Template

Picks a template from the template library, replaces each `{name}` with its value, and outputs `positive` / `negative`.

1. Add the node and choose a template from the dropdown.
2. Input fields for the template's variables appear on the node. An empty field counts as an empty string.
3. The pencil button (Edit) opens the editor, where you can create, duplicate, delete and edit templates. The editor is also available from the "Prompt Templates" tab in the left sidebar.

Template syntax:

```text
{quality}, {character}, {location}, {lighting}
```

- Only `{name}` (letters, digits and `_`) is replaced. Other forms such as `{a|b}` and `{{a}}` are left as they are, so you can combine templates with syntaxes like Dynamic Prompts.
- After replacement, leftover commas, periods and spaces from empty variables are cleaned up.
- Undefined variables and unclosed brackets produce warnings, not errors.

Storage and reproducibility:

- The library is saved to `ComfyUI/user/__nf_prompt_template/templates.json`. Set the `NF_PROMPT_TEMPLATE_DIR` environment variable to use another folder.
- On every queue, the node stores the content of the template it used as a snapshot. If the template is later removed from the library, the workflow still runs from the snapshot.
- Turn on `pin_snapshot` to always use the snapshot, even when the library changes.

### NF Independent Queue

Runs only the upstream part of this node instead of the whole workflow. Useful for regenerating LLM prompts until you like one.

1. Connect the output you want to check to the node's `value` input. Any type is accepted.
2. Press the node's **Run** button. Only the upstream branch runs, and the result is shown on the node. Text gets a Copy button; images are shown as a preview.
3. Press **Cancel** to stop a running job.

- The node has no outputs, so a normal Run (running the whole workflow) never executes it.
- `seed_mode` decides what happens to the upstream seeds before each Run:
  - `randomize`: use a new random value every time (default)
  - `follow`: follow each seed's control_after_generate setting
  - `off`: keep the seeds unchanged
- Example: set the LLM node's seed control to `fixed`, then regenerate with Independent Queue's Run. When you like the result, press the normal Run: the LLM node keeps the same seed, so its cached output is used and the image is generated from the prompt you chose.
- For now, the node only works in the root graph (not inside subgraphs).

### NF Preview Selector

Shows the images as a grid on the node and passes only the selected ones downstream. The queue is not blocked while you choose.

1. Connect images to `images`. To pick latents as well, also connect `latents`.
2. Run the workflow, or press the node's **Generate** button, to show the candidates. In review_and_select mode the downstream part stops here.
3. Click images to select them (multiple selection is allowed). The buttons at the bottom select all or clear the selection.
4. Press **Continue** to run only the downstream part with the selected images. The upstream part is not run again.

- `mode`
  - `review_and_select`: stop the downstream part until you pick images and press Continue (default)
  - `pass_through`: pass every image through
  - `take_first` / `take_last`: pass the first or the last image
- `seed_mode`: what to do with the upstream seeds before Generate (same as Independent Queue)
- Outputs: `selected_images`, `selected_latents`, `selection_indices` (e.g. `0,2`)
- Right-click an image to get **Copy Image / Open Image / Save Image** in the node menu. Copy Image only works when ComfyUI is opened over https or localhost. When you open it over plain http from another PC, use Open Image and copy from the new tab.
- Candidates are stored in ComfyUI's temp folder, which is cleared when ComfyUI restarts. Press Generate again after a restart.
- Workflows that contain the old node (`NFPreviewSelector2` from NF_Tools) can be updated with "Replace Node" in the error panel.

### NF Empty Latent Image

Creates an empty latent from a long-side size, an aspect ratio and an orientation. Outputs `latent` and the calculated `width` / `height`.

- `long_side`: size of the long side in pixels
- `aspect_ratio`: 1:1, 5:4, 4:3, 3:2, 16:9, 21:9, 4:5, 3:4, 2:3, 9:16
- `orientation`: `auto` (follow the aspect ratio), `portrait`, `landscape`
- `force_multiple_of_64`: round width and height to multiples of 64

### NF Preset Empty Latent Image

Creates an empty latent from a common size preset (SD 1.5, SDXL, HD, Full HD, 4K, Instagram, and more). With `Custom`, the `custom_width` / `custom_height` values are used. Outputs `latent` and the `width` / `height` used.

## Development

The frontend source is in `frontend/src`. After changing it, rebuild and commit `web/` together with the source.

```bash
cd frontend
npm install
npm test
npm run build
```

Run the Python tests with ComfyUI's venv:

```bash
python -m pytest
```

## License

[MIT](LICENSE)
