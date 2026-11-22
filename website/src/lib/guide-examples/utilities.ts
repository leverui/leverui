import type { GuideExampleMap } from './types';

/** Utilities guides' example sequence, headings, and Storybook-only omissions. */
export const utilityGuideExamples: GuideExampleMap = {
  checkmark: [
    { id: 'Basic' },
    { id: 'Indeterminate', title: 'Indeterminate' },
    { id: 'States', title: 'States' },
    { id: 'Variants', title: 'Variants' },
    { id: 'Sizes', title: 'Sizes' },
    { id: 'Colors', title: 'Colors' },
    { id: 'Filled', title: 'Filled' },
  ],
  'client-only': [
    { id: 'Basic' },
    { id: 'WithFallback', title: 'Fallback' },
    { id: 'RenderProp', title: 'Render Prop (Recommended)' },
  ],
  for: [
    { id: 'Basic' },
    { id: 'WithObject', title: 'Object' },
    { id: 'WithFallback', title: 'Fallback' },
  ],
  portal: [
    { id: 'Basic', omit: true },
    { id: 'Iframe', omit: true },
    { id: 'Container', omit: true },
  ],
  presence: [
    { id: 'Basic' },
    { id: 'Fade', title: 'Fade' },
    { id: 'ScaleFade', title: 'Scale Fade' },
    { id: 'SlideFade', title: 'Slide Fade' },
    { id: 'Slide', title: 'Slide' },
    { id: 'LazyMount', title: 'Lazy Mount' },
    { id: 'UnmountOnExit', title: 'Unmount On Exit' },
  ],
  radiomark: [
    { id: 'Basic' },
    { id: 'States', title: 'States' },
    { id: 'Variants', title: 'Variants' },
    { id: 'Sizes', title: 'Sizes' },
    { id: 'Colors', title: 'Colors' },
    { id: 'Filled', title: 'Filled' },
  ],
  show: [
    { id: 'Basic' },
    { id: 'WithFallback', title: 'Fallback' },
    { id: 'WithRenderProp', title: 'Render Prop' },
  ],
  'skip-nav': [
    { id: 'Basic' },
    { id: 'BasicExample', title: 'Basic Usage' },
    { id: 'CustomId', title: 'Custom ID' },
    { id: 'WithContent', title: 'With Main Content' },
  ],
  theme: [
    { id: 'Basic' },
    { id: 'Nested', title: 'Nested' },
    { id: 'Portalled', title: 'Portalled' },
  ],
  'visually-hidden': [{ id: 'Basic' }, { id: 'Input', title: 'Input' }],
};
