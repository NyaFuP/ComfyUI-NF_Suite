/** Copy / open / save an image by URL (browser APIs only, no ComfyUI imports). */

export class ImageActionError extends Error {}

async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url)
  if (!response.ok) throw new ImageActionError(`Could not load the image (HTTP ${response.status})`)
  return response.blob()
}

async function toPng(blob: Blob): Promise<Blob> {
  if (blob.type === 'image/png') return blob
  // Clipboard only accepts PNG: re-encode other formats through a canvas.
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new ImageActionError('PNG conversion failed'))), 'image/png')
  )
}

/**
 * Put the image on the clipboard. Browsers only allow this in a secure context
 * (https or localhost); over plain http from another PC it is not available.
 */
export async function copyImage(url: string): Promise<void> {
  if (!window.isSecureContext || !navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
    throw new ImageActionError(
      'The browser does not allow copying images here (needs https or localhost). Use Open Image and copy from the new tab.'
    )
  }
  // Call write() right away (still inside the click) and let the browser wait for the data:
  // awaiting the fetch first can lose the user activation that clipboard.write requires.
  const png = fetchBlob(url).then(toPng)
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })])
  } catch (e) {
    if (e instanceof DOMException && e.name === 'NotAllowedError') {
      throw new ImageActionError(
        'The browser blocked clipboard access. Allow the clipboard permission for this site, or use Open Image.'
      )
    }
    throw e
  }
}

export function openImage(url: string): void {
  window.open(url, '_blank', 'noopener')
}

export function saveImage(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}
