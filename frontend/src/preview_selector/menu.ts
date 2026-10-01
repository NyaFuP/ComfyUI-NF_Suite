/** Items added to NF Preview Selector's node context menu (via getNodeMenuItems). */
import { type ComfyNode, imageUrl, toast } from '@/core/comfy'
import { copyImage, openImage, saveImage } from '@/core/imageActions'

import { getController } from './controller'

export interface NodeMenuItem {
  content: string
  callback: () => void
}

export function previewSelectorMenuItems(node: ComfyNode): (NodeMenuItem | null)[] {
  const controller = getController(node)
  const index = controller?.menuTarget()
  if (!controller || index === null || index === undefined) return []

  const ref = controller.state.candidates[index]
  const url = imageUrl(ref)
  const label = `#${index + 1}`

  return [
    null, // separator
    {
      content: `Copy Image (${label})`,
      callback: () => {
        copyImage(url)
          .then(() => toast('success', 'Image copied', label))
          .catch((e: unknown) => toast('error', 'Copy Image failed', e instanceof Error ? e.message : String(e)))
      }
    },
    { content: `Open Image (${label})`, callback: () => openImage(url) },
    { content: `Save Image (${label})`, callback: () => saveImage(url, ref.filename) }
  ]
}
