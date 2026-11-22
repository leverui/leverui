import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { withToaster } from './examples/toast-region';
import { ToastAction, ToastPromise, ToastUpdate } from './examples/toast-actions';
import { ToastBasic, ToastClosable, ToastDuration, ToastPersistent } from './examples/toast-basic';
import { ToastLifecycle } from './examples/toast-lifecycle';
import { ToastPauseAndPlay } from './examples/toast-pause-and-play';
import { ToastExternalClose, ToastStatus } from './examples/toast-status';
import { ToastStatic } from './examples/toast-static';
import { markdownGuide } from './guide-markdown';

export const meta = {
  component: ToastBasic,
  decorators: [withComponentInset, withToaster],
} satisfies DemoMeta;

type Story = Demo;

/** Attach an optional description. */
function guide(description?: string): Story['parameters'] {
  return { guide: { ...(description && { description }) } };
}

export const Basic: Story = { render: ToastBasic, parameters: guide() };
export const Closable: Story = {
  render: ToastClosable,
  parameters: guide('Set the `closable` prop to `true` to create a closable toast.'),
};
export const ExternalClose: Story = {
  render: ToastExternalClose,
  parameters: markdownGuide(
    guide(
      'Use the `toaster.dismiss` method to close a toast.\n\n- `toaster.dismiss(id)`: Dismiss a toast by its id.\n- `toaster.dismiss()`: Dismiss all toasts.',
    ),
  ),
};
export const Status: Story = {
  render: ToastStatus,
  parameters: guide("Here's an example of each type of toast."),
};
export const Action: Story = {
  render: ToastAction,
  parameters: markdownGuide(
    guide(
      'Use the `action` prop with a `label` and `onClick` to add an action to the toast.\n\n> When the action trigger is clicked, the toast will be closed.',
    ),
  ),
};
export const Persistent: Story = {
  render: ToastPersistent,
  parameters: guide('Set the `type` prop to `"loading"` to create a persistent toast.'),
};
export const Promise: Story = {
  render: ToastPromise,
  parameters: markdownGuide(
    guide(
      'Use the `toaster.promise` to create a toast that resolves when the promise is resolved.\n\nNext, you can define the toast options (title, description, etc.) for each state of the promise.',
    ),
  ),
};
export const Update: Story = {
  render: ToastUpdate,
  parameters: guide('Use `toaster.update(...)` to modify a visible toast.'),
};
export const Duration: Story = {
  render: ToastDuration,
  parameters: guide('Use the `duration` prop to set the duration of the toast.'),
};
export const PauseAndPlay: Story = {
  render: ToastPauseAndPlay,
  parameters: markdownGuide(
    guide(
      'Use the `pause` and `resume` methods on the `toaster` object to pause and play the toast.\n\nPausing a toast prevents it from timing out, while resuming it will reenable the timeout using the remaining duration.',
    ),
  ),
};
export const Lifecycle: Story = {
  render: ToastLifecycle,
  parameters: guide(
    "Use the `onStatusChange` prop on the `toaster` function to listen for changes to the toast's status.",
  ),
};
export const Static: Story = { render: ToastStatic };
