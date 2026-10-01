/**
 * Global pass-through for unstyled PrimeVue: attach our own class names.
 * Styles live in styles.css and use ComfyUI's CSS variables.
 */
export const primeVuePassThrough = {
  select: {
    root: { class: 'nf-select' },
    label: { class: 'nf-select-label' },
    dropdown: { class: 'nf-select-dropdown' },
    overlay: { class: 'nf-overlay' },
    header: { class: 'nf-overlay-header' },
    pcFilter: { root: { class: 'nf-input nf-overlay-filter' } },
    listContainer: { class: 'nf-overlay-list-container' },
    list: { class: 'nf-overlay-list' },
    optionGroup: { class: 'nf-overlay-group' },
    option: { class: 'nf-overlay-option' },
    emptyMessage: { class: 'nf-overlay-empty' }
  },
  listbox: {
    root: { class: 'nf-listbox' },
    header: { class: 'nf-listbox-header' },
    pcFilter: { root: { class: 'nf-input' } },
    listContainer: { class: 'nf-listbox-list-container' },
    list: { class: 'nf-overlay-list' },
    optionGroup: { class: 'nf-overlay-group' },
    option: { class: 'nf-overlay-option' },
    emptyMessage: { class: 'nf-overlay-empty' }
  },
  inputtext: {
    root: { class: 'nf-input' }
  },
  button: {
    root: { class: 'nf-button' }
  },
  textarea: {
    root: { class: 'nf-input nf-textarea' }
  }
}
