import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { FieldHorizontal } from './examples/field-horizontal';
import {
  FieldBasic,
  FieldWithDisabled,
  FieldWithErrorIcon,
  FieldWithErrorText,
  FieldWithHelperText,
  FieldWithOptional,
  FieldWithRequired,
  FieldWithTextarea,
} from './examples/field-inputs';
import { FieldWithNativeSelect, FieldWithTargetControl } from './examples/field-native-select';

export const meta = {
  component: FieldBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description shown above an example on the website. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: FieldBasic };
export const ErrorText: Story = {
  render: FieldWithErrorText,
  parameters: guide(
    'Pass the `invalid` prop to `Field.Root` and use the `Field.ErrorText` to indicate that the field is invalid.',
  ),
};
export const ErrorIcon: Story = {
  render: FieldWithErrorIcon,
  parameters: guide(
    '`Field.ErrorIcon` inherits the surrounding text color and defaults to `1em`, keeping its size consistent even when `Field.ErrorText` stretches full width.',
  ),
};
export const HelperText: Story = {
  render: FieldWithHelperText,
  parameters: guide('Use the `Field.HelperText` to add helper text to the field.'),
};
export const Horizontal: Story = {
  render: FieldHorizontal,
  parameters: guide(
    'Use the `orientation="horizontal"` prop to align the label and input horizontally.',
  ),
};
export const Disabled: Story = {
  render: FieldWithDisabled,
  parameters: guide('Use the `disabled` prop to disable the field.'),
};
export const Textarea: Story = {
  render: FieldWithTextarea,
  parameters: guide("Here's how to use the field component with a textarea."),
};
export const NativeSelect: Story = {
  render: FieldWithNativeSelect,
  parameters: guide("Here's how to use the field component with a native select."),
};
export const TargetControl: Story = {
  render: FieldWithTargetControl,
  parameters: guide('Set the `target` prop on `Field.Root` to the item the label should point to.'),
};
export const Required: Story = {
  render: FieldWithRequired,
  parameters: guide(
    'Pass the `required` prop to `Field.Root` and use the `Field.RequiredIndicator` to indicate that the field is required.',
  ),
};
export const Optional: Story = {
  render: FieldWithOptional,
  parameters: guide(
    'Pass the `fallback` prop to the `Field.RequiredIndicator` to add optional text.',
  ),
};
