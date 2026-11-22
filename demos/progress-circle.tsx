import type { Demo, DemoMeta } from './demo-types';
import {
  ProgressCircleBasic,
  ProgressCircleIndeterminate,
  ProgressCircleWithRangeColor,
  ProgressCircleWithRoundCap,
  ProgressCircleWithThickness,
} from './examples/progress-circle-standard';
import {
  ProgressCircleWithColors,
  ProgressCircleWithSizes,
  ProgressCircleWithValueText,
} from './examples/progress-circle-matrices';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ProgressCircleBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: ProgressCircleBasic };
export const RoundCap: Story = {
  render: ProgressCircleWithRoundCap,
  parameters: guide(
    'Use the `strokeLinecap` prop on `ProgressCircle.Range` to make the ends of the progress circle rounded.',
  ),
};
export const Sizes: Story = {
  render: ProgressCircleWithSizes,
  parameters: guide('Use the `size` prop to change the size of the progress circle component.'),
};
export const Colors: Story = {
  render: ProgressCircleWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color scheme of the component.'),
};
export const ValueText: Story = {
  render: ProgressCircleWithValueText,
  parameters: guide(
    'Render the `ProgressCircle.ValueText` component to display the progress value.',
  ),
};
export const CustomThickness: Story = {
  render: ProgressCircleWithThickness,
  parameters: guide(
    'Pass the `--leverui-progress-circle-thickness` css variable to the `ProgressCircle.Circle` component to change the thickness of the ring.',
  ),
};
export const Indeterminate: Story = {
  render: ProgressCircleIndeterminate,
  parameters: guide('Set the `value` prop to `null` to render the indeterminate state.'),
};
export const RangeColor: Story = {
  render: ProgressCircleWithRangeColor,
  parameters: guide(
    'Pass the `stroke` prop to the `ProgressCircle.Range` component to change the color of the range.',
  ),
};
