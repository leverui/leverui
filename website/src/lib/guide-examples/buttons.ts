import type { GuideExampleMap } from './types';

/** Buttons guides' example sequence, headings, and Storybook-only omissions. */
export const buttonGuideExamples: GuideExampleMap = {
  button: [
    { id: 'Basic' },
    { id: 'Sizes', title: 'Sizes' },
    { id: 'Variants', title: 'Variants' },
    { id: 'Icon', title: 'Icon' },
    { id: 'Color', title: 'Color' },
    { id: 'Disabled', title: 'Disabled' },
    { id: 'DisabledLink', title: 'Disabled Link' },
    { id: 'Loading', title: 'Loading' },
    { id: 'LoadingToggle', title: 'Loading' },
    { id: 'SpinnerPlacement', title: 'Spinner Placement' },
    { id: 'CustomSpinner', title: 'Custom Spinner' },
    { id: 'Group', title: 'Group' },
    { id: 'GroupFlushed', title: 'Group' },
    { id: 'SplitMenu', title: 'Split Menu' },
    { id: 'ResponsiveSize', title: 'Responsive Size' },
    { id: 'Radius', title: 'Radius' },
    { id: 'AsLink', title: 'As Link' },
    { id: 'IconComposition', omit: true },
    { id: 'StyleOverrides', omit: true },
  ],
  'close-button': [
    { id: 'Basic' },
    { id: 'Sizes', title: 'Sizes' },
    { id: 'Variants', title: 'Variants' },
    { id: 'CustomIcon', title: 'Custom Icon' },
  ],
  'download-trigger': [
    { id: 'Basic' },
    { id: 'BasicExample', title: 'Basic' },
    { id: 'Svg', title: 'Download SVG' },
    { id: 'Promise', title: 'Promise' },
    { id: 'FileSize', title: 'File Size' },
  ],
  'icon-button': [
    { id: 'Basic' },
    { id: 'Sizes', title: 'Sizes' },
    { id: 'Variants', title: 'Variants' },
    { id: 'Colors', title: 'Color' },
    { id: 'Rounded', title: 'Rounded' },
  ],
};
