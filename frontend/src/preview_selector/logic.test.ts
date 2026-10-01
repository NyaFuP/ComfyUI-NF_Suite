import { describe, expect, it } from 'vitest'

import type { ApiPrompt } from '@/core/prompt'

import { buildContinuePrompt, downstreamOutputs, formatSelection, toggleIndex } from './logic'

const PROMPT: ApiPrompt = {
  img: { class_type: 'EmptyImage', inputs: { width: 8 } },
  sel: { class_type: 'NF_PreviewSelector', inputs: { images: ['img', 0], mode: 'review_and_select' }, _meta: { title: 'Sel' } },
  up: { class_type: 'Upscale', inputs: { image: ['sel', 0] } },
  out1: { class_type: 'PreviewImage', inputs: { images: ['up', 0] } },
  out2: { class_type: 'SaveImage', inputs: { images: ['sel', 0] } },
  other: { class_type: 'SaveImage', inputs: { images: ['img', 0] } }
}
const OUTPUTS = new Set(['PreviewImage', 'SaveImage', 'NF_PreviewSelector'])
const isOutput = (classType: string) => OUTPUTS.has(classType)

describe('downstreamOutputs', () => {
  it('returns output nodes that depend on the selector (directly or not)', () => {
    expect(downstreamOutputs(PROMPT, 'sel', isOutput).sort()).toEqual(['out1', 'out2'])
  })

  it('does not include the selector itself or unrelated outputs', () => {
    const result = downstreamOutputs(PROMPT, 'sel', isOutput)
    expect(result).not.toContain('sel')
    expect(result).not.toContain('other')
  })

  it('is empty when nothing downstream is an output', () => {
    expect(downstreamOutputs(PROMPT, 'sel', () => false)).toEqual([])
  })
})

describe('buildContinuePrompt', () => {
  it('swaps the selector to the source variant and cuts its upstream links', () => {
    const result = buildContinuePrompt(PROMPT, 'sel', 'b'.repeat(32), [2, 0])
    expect(result.sel).toEqual({
      class_type: 'NF_PreviewSelectorSource',
      inputs: { batch_id: 'b'.repeat(32), selection: '0,2' },
      _meta: { title: 'Sel' }
    })
    expect(PROMPT.sel.class_type).toBe('NF_PreviewSelector')
  })

  it('throws when the selector is not in the prompt', () => {
    expect(() => buildContinuePrompt(PROMPT, 'missing', 'x', [0])).toThrow(/missing/)
  })
})

describe('selection helpers', () => {
  it('toggleIndex adds and removes, keeping order', () => {
    expect(toggleIndex([0, 3], 2)).toEqual([0, 2, 3])
    expect(toggleIndex([0, 2, 3], 2)).toEqual([0, 3])
  })

  it('formatSelection sorts and dedupes', () => {
    expect(formatSelection([3, 1, 3])).toBe('1,3')
  })
})
