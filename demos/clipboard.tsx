import type { Demo, DemoMeta } from './demo-types';
import {
  ClipboardBasic,
  ClipboardWithButton,
  ClipboardWithInput,
  ClipboardWithLink,
  ClipboardWithStore,
  ClipboardWithTimeout,
} from './examples/clipboard-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ClipboardBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: ClipboardBasic };
export const Button: Story = {
  render: ClipboardWithButton,
  parameters: guide('Use the `Clipboard.Trigger` component to create a copy button.'),
};
export const Input: Story = {
  render: ClipboardWithInput,
  parameters: guide('Use the `Clipboard.Input` component to create a copy input.'),
};
export const Timeout: Story = {
  render: ClipboardWithTimeout,
  parameters: guide('Use the `timeout` prop to change the duration of the copy message.'),
};
export const Link: Story = {
  render: ClipboardWithLink,
  parameters: guide(
    "Here's an example that combines the `Clipboard.Trigger` and `Clipboard.ValueText` components to create a link appearance.",
  ),
};
export const Store: Story = {
  render: ClipboardWithStore,
  parameters: guide(
    'Alternatively, you can use the `useClipboard` hook to create a custom component.',
  ),
};
