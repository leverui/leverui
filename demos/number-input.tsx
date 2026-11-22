import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  NumberInputElement,
  NumberInputFormatOptions,
  NumberInputScrubber,
  NumberInputSizes,
  NumberInputStepper,
} from './examples/number-input-display';
import { NumberInputControlled, NumberInputHookForm } from './examples/number-input-state';
import {
  NumberInputBasic,
  NumberInputDisabled,
  NumberInputField,
  NumberInputInvalid,
  NumberInputMinMax,
  NumberInputMouseWheel,
  NumberInputStep,
} from './examples/number-input-standard';

export const meta = {
  component: NumberInputBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one guide example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

export const Basic: Story = { render: NumberInputBasic };
export const Sizes: Story = {
  render: NumberInputSizes,
  parameters: guide(
    'Pass the `size` prop to the `NumberInput.Root` component to change the size of the number input.',
  ),
};
export const FormatOptions: Story = {
  render: NumberInputFormatOptions,
  parameters: guide(
    'Pass the `formatOptions` prop to the `NumberInput.Root` component to format the number input value. The value of this maps to `Intl.NumberFormatOptions` and is applied based on the current locale.',
  ),
};
export const MinMax: Story = {
  render: NumberInputMinMax,
  parameters: guide(
    'Pass the `min` and `max` props to the `NumberInput.Root` component to set the minimum and maximum values of the number input.',
    'If value entered is less than `min` or greater than `max`, the value will be clamped to the nearest boundary on blur, or enter key press.',
  ),
};
export const Step: Story = {
  render: NumberInputStep,
  parameters: guide(
    'Pass the `step` prop to the `NumberInput.Root` component to change the increment or decrement interval of the number input.',
  ),
};
export const Controlled: Story = {
  render: NumberInputControlled,
  parameters: guide(
    'Pass the `value` and `onValueChange` props to the `NumberInput.Root` component to control the value of the number input.',
  ),
};
export const Stepper: Story = {
  render: NumberInputStepper,
  parameters: guide("Here's an example of how to compose the number input as a mobile stepper."),
};
export const MouseWheel: Story = {
  render: NumberInputMouseWheel,
  parameters: guide(
    'Pass the `allowMouseWheel` prop to the `NumberInput.Root` component to enable or disable the mouse wheel to change',
  ),
};
export const Disabled: Story = {
  render: NumberInputDisabled,
  parameters: guide(
    'Pass the `disabled` prop to the `NumberInput.Root` component to disable the number input.',
  ),
};
export const Invalid: Story = {
  render: NumberInputInvalid,
  parameters: guide(
    'Use the `Field` component and the `invalid` prop to indicate that the number input is invalid.',
  ),
};
export const Field: Story = {
  render: NumberInputField,
  parameters: guide(
    'Compose the `Field` and `Field.HelperText` components to add helper text to the number input.',
  ),
};
export const Element: Story = {
  render: NumberInputElement,
  parameters: guide(
    "Here's an example of how to compose the number input with the input group component to add an element on either the left or right.",
  ),
};
export const Scrubber: Story = {
  render: NumberInputScrubber,
  parameters: guide(
    'Use the `NumberInput.Scrubber` component to make the number input supports scrubber interactions.',
  ),
};
export const HookForm: Story = {
  render: NumberInputHookForm,
  parameters: guide(
    'Here is an example of how to use the `NumberInput` component with Solid form state.',
  ),
};
