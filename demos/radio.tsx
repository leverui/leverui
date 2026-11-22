import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { RadioWithColors, RadioWithSizes, RadioWithVariants } from './examples/radio-display';
import { RadioWithHookForm } from './examples/radio-form';
import { RadioBasic, RadioControlled, RadioDisabled } from './examples/radio-standard';
import { RadioSizeTable, RadioVariantTable } from './examples/radio-tables';

export const meta = {
  component: RadioBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: RadioBasic };
export const Controlled: Story = {
  render: RadioControlled,
  parameters: guide(
    'Pass the `value` and `onValueChange` props to the `RadioGroup.Root` component to control the selected radio button.',
  ),
};
export const Colors: Story = {
  render: RadioWithColors,
  parameters: guide(
    'Pass the `colorPalette` prop to the `RadioGroup.Root` component to change the color scheme of the component.',
  ),
};
export const Sizes: Story = {
  render: RadioWithSizes,
  parameters: guide(
    'Pass the `size` prop to the `RadioGroup.Root` component to change the size of the radio component.',
  ),
};
export const Variants: Story = {
  render: RadioWithVariants,
  parameters: guide(
    'Pass the `variant` prop to the `RadioGroup.Root` component to change the appearance of the radio component.',
  ),
};
export const Disabled: Story = {
  render: RadioDisabled,
  parameters: guide(
    'Pass the `disabled` prop to the `RadioGroup.Item` component to make the radio disabled.',
  ),
};
export const HookForm: Story = {
  render: RadioWithHookForm,
  parameters: guide('Use a Solid signal to control the radio group within a form.'),
};
export const SizeMatrix: Story = { render: RadioSizeTable };
export const VariantMatrix: Story = { render: RadioVariantTable };
