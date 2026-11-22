/** Keep component page navigation in the same order as the public docs catalog. */
export const guidePageOrder = [
  'aspect-ratio bleed box absolute-center center container flex float grid group scroll-area separator simple-grid splitter stack wrap',
  'blockquote code code-block em heading highlight kbd link link-overlay list mark prose text',
  'button close-button icon-button download-trigger',
  'date-input date-picker calendar',
  'checkbox checkbox-card color-picker color-swatch editable field fieldset file-upload input number-input password-input pin-input radio-card radio rating segmented-control native-select switch slider textarea tags-input',
  'combobox command listbox select tree-view',
  'action-bar dialog drawer floating-panel hover-card menu overlay-manager popover toggle-tip tooltip',
  'accordion breadcrumb carousel collapsible pagination steps tabs',
  'alert empty-state progress-circle progress skeleton spinner status toast',
  'avatar badge card clipboard image data-list icon marquee qr-code stat table tag timeline',
  'locale-provider format-number format-byte',
  'checkmark client-only environment-provider for presence portal radiomark show skip-nav visually-hidden theme',
  'use-chart axes cartesian-grid area-chart bar-chart bar-list bar-segment donut-chart line-chart pie-chart radar-chart scatter-chart sparkline',
].flatMap(
  /** Expand each catalog group while preserving its order. */
  (group) => group.split(' '),
);
