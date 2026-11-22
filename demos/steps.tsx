import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { StepsWithSizes, StepsWithVariants } from './examples/steps-appearance';
import { StepsWithColors } from './examples/steps-colors';
import { StepsDescription } from './examples/steps-description';
import { StepsIcon } from './examples/steps-icon';
import { StepsVertical } from './examples/steps-layout';
import { StepsLines } from './examples/steps-lines';
import { StepsSizes, StepsVariants } from './examples/steps-matrices';
import { StepsBasic, StepsNumberOnly, StepsTrigger } from './examples/steps-standard';
import { StepsControlled, StepsStore } from './examples/steps-state';
import { StepsValidation } from './examples/steps-validation';

export const meta = {
  component: StepsBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: StepsBasic };
export const Sizes: Story = {
  render: StepsWithSizes,
  parameters: guide('Use the `size` prop to change the size of the steps component.'),
};
export const Variants: Story = {
  render: StepsWithVariants,
  parameters: guide('Use the `variant` prop to change the appearance of the steps component.'),
};
export const Colors: Story = {
  render: StepsWithColors,
  parameters: guide('Use the `colorPalette` prop to change the color scheme of the component.'),
};
export const Trigger: Story = {
  render: StepsTrigger,
  parameters: guide('Use the `Steps.Trigger` component to make the step clickable.'),
};
export const Vertical: Story = {
  render: StepsVertical,
  parameters: guide('Use the `orientation` prop to change the orientation of the steps component.'),
};
export const Controlled: Story = {
  render: StepsControlled,
  parameters: guide(
    'Use the `value` and `onValueChange` props to control the current step of the steps component.',
  ),
};
export const Validation: Story = {
  render: StepsValidation,
  parameters: guide(
    'Mark an item `invalid` to stop navigation past it in `linear` mode. Use the `onNavigationBlocked` prop to handle the blocked transition.',
  ),
};
export const Store: Story = {
  render: StepsStore,
  parameters: guide(
    'An alternative way to control the steps is to use the `RootProvider` component and the `useSteps` store hook. This way you can access the steps state and methods from outside the steps.',
  ),
};
export const Icon: Story = {
  render: StepsIcon,
  parameters: guide('Pass an icon to `Steps.Status` within `Steps.Indicator` to display an icon.'),
};
export const Description: Story = {
  render: StepsDescription,
  parameters: guide(
    'Render a `Steps.Description` beside the `Steps.Title` to display a description.',
  ),
};
export const SizeMatrix: Story = { name: 'SizeMatrix', render: StepsSizes };
export const VariantMatrix: Story = { name: 'VariantMatrix', render: StepsVariants };
export const Lines: Story = { render: StepsLines };
export const NumberOnly: Story = { render: StepsNumberOnly };
