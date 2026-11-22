import type { Demo, DemoMeta } from './demo-types';
import {
  ProgressBasic,
  ProgressIndeterminate,
  ProgressWithAnimatedStripes,
  ProgressWithInlineLabel,
  ProgressWithLabel,
  ProgressWithLabelInfo,
  ProgressWithSizes,
  ProgressWithStripes,
  ProgressWithVariants,
} from './examples/progress-standard';
import {
  ProgressSizeTable,
  ProgressVariantTable,
  ProgressWithColors,
} from './examples/progress-matrices';
import { ProgressComposition } from './examples/progress-composition';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ProgressBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: ProgressBasic };
export const Sizes: Story = {
  render: ProgressWithSizes,
  parameters: guide('Use the `size` prop to change the size of the progress bar.'),
};
export const Variants: Story = {
  render: ProgressWithVariants,
  parameters: guide('Use the `variant` prop to change the visual style of the progress bar.'),
};
export const Colors: Story = {
  render: ProgressWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color of the progress bar.'),
};
export const InlineLabel: Story = {
  render: ProgressWithInlineLabel,
  parameters: guide(
    'Compose the `Progress.Label` and `Progress.ValueText` components to create an inline label for the progress bar.',
  ),
};
export const LabelInfo: Story = {
  render: ProgressWithLabelInfo,
  parameters: guide(
    'Use a `Popover` inside `Progress.Label` to add a tooltip to the progress bar.',
  ),
};
export const Indeterminate: Story = {
  render: ProgressIndeterminate,
  parameters: guide('Set the value to `null` to show an indeterminate progress bar.'),
};
export const Stripes: Story = {
  render: ProgressWithStripes,
  parameters: guide('Set the `striped` prop to `true` to add stripes to the progress bar.'),
};
export const AnimatedStripes: Story = {
  render: ProgressWithAnimatedStripes,
  parameters: guide('Set the `animated` prop to `true` to animate the stripes.'),
};
export const SizeMatrix: Story = { render: ProgressSizeTable };
export const VariantMatrix: Story = { render: ProgressVariantTable };
export const Label: Story = { render: ProgressWithLabel };
export const Composition: Story = { render: ProgressComposition };
