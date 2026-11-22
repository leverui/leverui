import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { OverlayBasic, OverlayReturnValue, OverlayUpdate } from './examples/overlay-basic-examples';
import { OverlayAlert, OverlayDrawer } from './examples/overlay-alert-drawer';
import { OverlayForm, OverlayMenuItem } from './examples/overlay-form-menu';

export const meta = {
  component: OverlayBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach copy and any follow-up note to a demo. */
function guide(description: string, options: { after?: string } = {}): Story['parameters'] {
  return {
    guide: {
      description,
      ...(options.after !== undefined && { after: options.after }),
    },
  };
}

const programmaticClosing = `This is useful for scenarios like form submissions or user interactions that should close the overlay.

\`\`\`tsx
const dialog = createOverlay<DialogProps>((props) => {
  const [, rest] = splitProps(props, ['title']);

  /** Close the overlay after a successful action. */
  function handleSubmit() {
    props.onOpenChange?.({ open: false });
  }

  return <Dialog.Root {...rest}>{/* ... */}</Dialog.Root>;
});
\`\`\``;

export const Basic: Story = {
  render: OverlayBasic,
  parameters: guide(
    "Here's an example of a dialog component that can be programmatically controlled.",
  ),
};
export const Drawer: Story = {
  render: OverlayDrawer,
  parameters: guide(
    "Here's an example of a drawer component that can be programmatically controlled.",
  ),
};
export const Update: Story = {
  render: OverlayUpdate,
  parameters: guide('Use the `.update` method to update the props of an overlay.'),
};
export const ReturnValue: Story = {
  render: OverlayReturnValue,
  parameters: guide(
    'Awaiting the result of the `.open()` method returns the value passed to the `.close()` method.',
    {
      after:
        '> **Bonus:** You can also use the `.waitForExit()` method to wait for the exit animation to complete before opening a new overlay.',
    },
  ),
};
export const MenuItem: Story = {
  render: OverlayMenuItem,
  parameters: guide(
    'Use the overlay manager to manage dialogs that can be opened from menu items. The `.open()` method can be called to open the dialog.',
    {
      after:
        '> This approach avoids unexpected close behavior caused by event bubbling and portals.',
    },
  ),
};
export const Form: Story = {
  render: OverlayForm,
  parameters: guide(
    'You can close an overlay from within the component itself by calling the injected `onOpenChange` prop with `{ open: false }`.',
    { after: programmaticClosing },
  ),
};
export const Alert: Story = { render: OverlayAlert };
