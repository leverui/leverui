import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { PasswordInputWithHookForm } from './examples/password-input-form';
import {
  PasswordInputBasic,
  PasswordInputControlled,
  PasswordInputControlledVisibility,
  PasswordInputWithSizes,
} from './examples/password-input-standard';
import { PasswordInputWithStrengthIndicator } from './examples/password-input-strength';

export const meta = {
  component: PasswordInputBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach copy to one example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

export const Basic: Story = { render: PasswordInputBasic };
export const Sizes: Story = {
  render: PasswordInputWithSizes,
  parameters: guide(
    'Use the `size` prop to change the size of the password input.',
    '> The password input sizes are mapped to the `Input` component sizes.',
  ),
};
export const Controlled: Story = {
  render: PasswordInputControlled,
  parameters: guide('Use the `value` and `onInput` props to control the current value.'),
};
export const HookForm: Story = {
  render: PasswordInputWithHookForm,
  parameters: guide(
    "Here's an example of how to use the `PasswordInput` component in a Solid form with native submission.",
  ),
};
export const ControlledVisibility: Story = {
  render: PasswordInputControlledVisibility,
  parameters: guide(
    'Use the `visible` and `onVisibleChange` props to control the visibility of the password input.',
  ),
};
export const StrengthIndicator: Story = {
  render: PasswordInputWithStrengthIndicator,
  parameters: guide(
    'Render the `PasswordStrengthMeter` component to show the strength of the password. Compute the `value` prop based on the password input `value`.',
  ),
};
