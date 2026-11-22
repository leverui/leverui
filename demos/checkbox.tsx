import type { Demo, DemoMeta } from './demo-types';
import './examples/checkbox-examples.css';
import {
  CheckboxWithColors,
  CheckboxWithCustomIcon,
  CheckboxWithDescription,
  CheckboxWithLink,
} from './examples/checkbox-display';
import {
  CheckboxWithForm,
  CheckboxWithGroup,
  CheckboxWithGroupHookForm,
  CheckboxWithHookForm,
} from './examples/checkbox-forms';
import { CheckboxIndeterminate } from './examples/checkbox-indeterminate';
import {
  CheckboxBasic,
  CheckboxControlled,
  CheckboxWithLabelPosition,
  CheckboxWithSizes,
  CheckboxWithStates,
  CheckboxWithStore,
  CheckboxWithVariants,
} from './examples/checkbox-standard';
import { CheckboxSizeTable, CheckboxVariantTable } from './examples/checkbox-tables';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: CheckboxBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: CheckboxBasic };
export const Variants: Story = {
  render: CheckboxWithVariants,
  parameters: guide(
    'Pass the `variant` prop to the `Checkbox.Root` component to change the visual style of the checkbox.',
  ),
};
export const Colors: Story = {
  render: CheckboxWithColors,
  parameters: guide(
    'Pass the `colorPalette` prop to the `Checkbox.Root` component to change the color of the checkbox.',
  ),
};
export const Sizes: Story = {
  render: CheckboxWithSizes,
  parameters: guide(
    'Pass the `size` prop to the `Checkbox.Root` component to change the size of the checkbox.',
  ),
};
export const States: Story = {
  render: CheckboxWithStates,
  parameters: guide(
    'Pass the `disabled` or `invalid` prop to the `Checkbox.Root` component to change the visual state of the checkbox.',
  ),
};
export const Controlled: Story = {
  render: CheckboxControlled,
  parameters: guide(
    'Use the `checked` and `onCheckedChange` props to control the state of the checkbox.',
  ),
};
export const LabelPosition: Story = {
  render: CheckboxWithLabelPosition,
  parameters: guide("Here's an example of how to change the label position to the right."),
};
export const Store: Story = {
  render: CheckboxWithStore,
  parameters: guide(
    'An alternative way to control the checkbox is to use the `RootProvider` component and the `useCheckbox` store hook.',
  ),
};
export const Form: Story = {
  render: CheckboxWithForm,
  parameters: guide("Here's an example of how to compose a checkbox with a field component."),
};
export const HookForm: Story = {
  render: CheckboxWithHookForm,
  parameters: guide(
    "Here's an example of how to use the `Checkbox` component with form state held in a Solid signal.",
  ),
};
export const Group: Story = {
  render: CheckboxWithGroup,
  parameters: guide('Use the `CheckboxGroup` component to group multiple checkboxes together.'),
};
export const GroupHookForm: Story = {
  render: CheckboxWithGroupHookForm,
  parameters: guide(
    "Here's an example of how to use the `CheckboxGroup` component with form state held in a Solid signal.",
  ),
};
export const CustomIcon: Story = {
  render: CheckboxWithCustomIcon,
  parameters: guide(
    'Render a custom icon within `Checkbox.Control` to change the icon of the checkbox.',
  ),
};
export const Indeterminate: Story = {
  render: CheckboxIndeterminate,
  parameters: guide(
    'Set the `checked` prop to `indeterminate` to show the checkbox in an indeterminate state.',
  ),
};
export const Description: Story = {
  render: CheckboxWithDescription,
  parameters: guide("Here's an example of how to add some further description to the checkbox."),
};
export const Link: Story = {
  render: CheckboxWithLink,
  parameters: guide('Render an anchor tag within the `Checkbox.Label` to add a link to the label.'),
};
export const SizeMatrix: Story = { render: CheckboxSizeTable };
export const VariantMatrix: Story = { render: CheckboxVariantTable };
