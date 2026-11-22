import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  PinInputSanitizedValue,
  PinInputSizes,
  PinInputWithSeparator,
} from './examples/pin-input-layout';
import {
  PinInputAutoSubmit,
  PinInputControlled,
  PinInputWithHookForm,
  PinInputWithStore,
} from './examples/pin-input-state';
import {
  PinInputAlphanumeric,
  PinInputAttached,
  PinInputBasic,
  PinInputWithField,
  PinInputWithMask,
  PinInputWithOtp,
  PinInputWithPlaceholder,
} from './examples/pin-input-standard';

export const meta = {
  component: PinInputBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach copy to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: PinInputBasic };
export const Sizes: Story = {
  render: PinInputSizes,
  parameters: guide(
    'Pass the `size` prop to the `PinInput.Root` component to change the size of the pin input component',
  ),
};
export const WithOtp: Story = {
  render: PinInputWithOtp,
  parameters: guide(
    'Pass the `otp` prop to the `PinInput.Root` component to make the pin input component behave like a one-time code input. This helps improve the user experience when entering OTP codes',
  ),
};
export const AutoSubmit: Story = {
  render: PinInputAutoSubmit,
  parameters: guide(
    'Use the `autoSubmit` prop to submit the owning form automatically when every input has been filled.',
  ),
};
export const SanitizedValue: Story = {
  render: PinInputSanitizedValue,
  parameters: {
    guide: {
      description:
        'Use the `normalizeValue` prop to remove formatting such as dashes or spaces from pasted values before validation.',
    },
  },
};
export const WithMask: Story = {
  render: PinInputWithMask,
  parameters: guide(
    'Pass the `mask` prop to the `PinInput.Root` component to obscure the entered pin code',
  ),
};
export const WithPlaceholder: Story = {
  render: PinInputWithPlaceholder,
  parameters: guide(
    'Pass the `placeholder` prop to the `PinInput.Root` component to add a placeholder to the pin input',
  ),
};
export const WithField: Story = {
  render: PinInputWithField,
  parameters: guide(
    "Here's an example of how to compose the `Field` and the `PinInput` components",
  ),
};
export const WithHookForm: Story = {
  render: PinInputWithHookForm,
  parameters: guide(
    "Here's an example of how to compose the `Field` and the `PinInput` components in a Solid form with signal-based validation",
  ),
};
export const Controlled: Story = {
  render: PinInputControlled,
  parameters: guide(
    'Pass the `value` and `onValueChange` props to the `PinInput.Root` component to control the value of the pin input',
  ),
};
export const WithStore: Story = {
  render: PinInputWithStore,
  parameters: guide(
    'An alternative way to control the pin input is to use the `RootProvider` component and the `usePinInput` store hook. This way you can access the pin input state and methods from outside the component.',
  ),
};
export const Attached: Story = {
  render: PinInputAttached,
  parameters: guide(
    'Pass the `attached` prop to the `PinInput.Root` component to attach the pin input to the input field',
  ),
};
export const WithSeparator: Story = {
  render: PinInputWithSeparator,
  parameters: {
    guide: {
      description:
        'Wrap each segment in `Group` with `attached`, add a separator between segments in `PinInput.Control`, and set `count` on `PinInput.Root` to the input count.',
    },
  },
};
export const Alphanumeric: Story = {
  render: PinInputAlphanumeric,
  parameters: guide(
    'Pass the `type` prop to the `PinInput.Root` component to allow the user to enter alphanumeric characters. Values can be either `alphanumeric`, `numeric`, or `alphabetic`',
  ),
};
