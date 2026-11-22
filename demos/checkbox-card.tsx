import type { Demo, DemoMeta } from './demo-types';
import './examples/checkbox-card-examples.css';
import { CheckboxCardWithGroup, CheckboxCardWithIcon } from './examples/checkbox-card-group';
import {
  CheckboxCardBasic,
  CheckboxCardNoIndicator,
  CheckboxCardWithAddon,
  CheckboxCardWithDescription,
  CheckboxCardWithSizes,
  CheckboxCardWithVariants,
} from './examples/checkbox-card-standard';
import { CheckboxCardDisabled, CheckboxCardWithStates } from './examples/checkbox-card-states';
import { CheckboxCardSizeTable, CheckboxCardVariantTable } from './examples/checkbox-card-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: CheckboxCardBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: CheckboxCardBasic };
export const Description: Story = {
  render: CheckboxCardWithDescription,
  parameters: guide(
    'Use the `CheckboxCard.Description` component to add a description to the checkbox card.',
  ),
};
export const Group: Story = {
  render: CheckboxCardWithGroup,
  parameters: guide('Use the `CheckboxGroup` component to group multiple checkbox cards.'),
};
export const Sizes: Story = {
  render: CheckboxCardWithSizes,
  parameters: guide(
    'Pass the `size` prop to the `CheckboxCard.Root` component to change the size of the checkbox card.',
  ),
};
export const Variants: Story = {
  render: CheckboxCardWithVariants,
  parameters: guide(
    'Pass the `variant` prop to the `CheckboxCard.Root` component to change the variant of the checkbox card.',
  ),
};
export const Disabled: Story = {
  render: CheckboxCardDisabled,
  parameters: guide(
    'Pass the `disabled` prop to the `CheckboxCard.Root` component to make the checkbox card disabled.',
  ),
};
export const Addon: Story = {
  render: CheckboxCardWithAddon,
  parameters: guide(
    'Render additional content within the `CheckboxCard.Addon` component to add some more context to the checkbox card.',
  ),
};
export const NoIndicator: Story = {
  render: CheckboxCardNoIndicator,
  parameters: guide("Here's an example of how to use the checkbox card without an indicator."),
};
export const Icon: Story = {
  render: CheckboxCardWithIcon,
  parameters: guide("Here's an example of how to render custom icons within the checkbox card."),
};

export const States: Story = { render: CheckboxCardWithStates };
export const VariantMatrix: Story = { render: CheckboxCardVariantTable };
export const SizeMatrix: Story = { render: CheckboxCardSizeTable };
