import type { Demo, DemoMeta } from './demo-types';
import { DialogBasic, DialogControlled, DialogStore } from './examples/dialog-basic';
import { DialogDatalist } from './examples/dialog-data';
import { withComponentInset } from './examples/example-frame';
import { DialogFinalFocus, DialogInitialFocus } from './examples/dialog-focus';
import { initialFocusNote, nonModalNote, responsiveNote } from './examples/dialog-guide-notes';
import { DialogBackdropBlur, DialogNonModal, DialogRole } from './examples/dialog-modal';
import { DialogCloseOutside, DialogNested } from './examples/dialog-nested';
import { DialogOpenFromMenu, DialogOpenFromPopover } from './examples/dialog-overlays';
import {
  DialogFullscreen,
  DialogMotionPreset,
  DialogResponsiveSize,
} from './examples/dialog-presets';
import { DialogInsideScroll, DialogOutsideScroll } from './examples/dialog-scroll';
import { DialogCover, DialogPlacement, DialogSizes } from './examples/dialog-sizes';
import { DialogContext, DialogMultipleTriggers } from './examples/dialog-state';

export const meta = {
  component: DialogBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description and any note shown after the example. */
function guide(description: string, options: { after?: string } = {}) {
  return {
    guide: {
      description,
      ...(options.after !== undefined && { after: options.after }),
    },
  };
}

export const Basic: Story = { render: DialogBasic };
export const Sizes: Story = {
  render: DialogSizes,
  parameters: guide('Use the `size` prop to change the size of the dialog component.'),
};
export const Cover: Story = {
  render: DialogCover,
  parameters: guide(
    'Use the `size="cover"` prop to make the dialog component cover the entire screen while revealing a small portion of the page behind.',
  ),
};
export const Fullscreen: Story = {
  render: DialogFullscreen,
  parameters: guide(
    'Use the `size="full"` prop to make the dialog component take up the entire screen.',
  ),
};
export const ResponsiveSize: Story = {
  render: DialogResponsiveSize,
  parameters: guide(
    'Use responsive values for the `size` prop to make the dialog adapt to different screen sizes.',
    { after: responsiveNote },
  ),
};
export const Placement: Story = {
  render: DialogPlacement,
  parameters: guide('Use the `placement` prop to change the placement of the dialog component.'),
};
export const Controlled: Story = {
  render: DialogControlled,
  parameters: guide(
    'Use the `open` and `onOpenChange` prop to control the visibility of the dialog component.',
  ),
};
export const MultipleTriggers: Story = {
  render: DialogMultipleTriggers,
  parameters: guide(
    "Don't mount a dialog per row. Put `value` on each `Trigger` under one `Root`. Read `triggerValue` from context to fill the title and body.",
  ),
};
export const Store: Story = {
  render: DialogStore,
  parameters: guide(
    'An alternative way to control the dialog is to use the `RootProvider` component and the `useDialog` store hook. This way you can access the dialog state and methods from outside the dialog.',
  ),
};
export const Context: Story = {
  render: DialogContext,
  parameters: guide(
    'Use the `Dialog.Context` component to access the dialog state and methods from outside the dialog.',
  ),
};
export const Nested: Story = {
  render: DialogNested,
  parameters: guide(
    'You can nest dialogs by using the `Dialog.Root` component inside another `Dialog.Root` component.',
  ),
};
export const OpenFromPopover: Story = {
  render: DialogOpenFromPopover,
  parameters: guide(
    'Dialogs can be triggered from within a popover. The dialog will appear above the popover thanks to the unified z-index system.',
  ),
};
export const OpenFromMenu: Story = {
  render: DialogOpenFromMenu,
  parameters: guide(
    'Use a controlled dialog to open it from a menu item action, like a delete confirmation.',
  ),
};
export const InitialFocus: Story = {
  render: DialogInitialFocus,
  parameters: guide(
    'Use the `initialFocusEl` prop to set the initial focus of the dialog component.',
    {
      after: initialFocusNote,
    },
  ),
};
export const InsideScroll: Story = {
  render: DialogInsideScroll,
  parameters: guide(
    'Use the `scrollBehavior=inside` prop to change the scroll behavior of the dialog when its content overflows.',
  ),
};
export const OutsideScroll: Story = {
  render: DialogOutsideScroll,
  parameters: guide(
    'Use the `scrollBehavior=outside` prop to change the scroll behavior of the dialog when its content overflows.',
  ),
};
export const MotionPreset: Story = {
  render: DialogMotionPreset,
  parameters: guide('Use the `motionPreset` prop to change the animation of the dialog component.'),
};
export const Role: Story = {
  render: DialogRole,
  parameters: guide(
    'Set the `role: "alertdialog"` prop to change the dialog component to an alert dialog.',
  ),
};
export const CloseOutside: Story = {
  render: DialogCloseOutside,
  parameters: guide(
    "Here's an example of how to customize the `Dialog.CloseTrigger` component to position the close button outside the dialog component.",
  ),
};
export const NonModal: Story = {
  render: DialogNonModal,
  parameters: guide(
    "We don't recommend using a non-modal dialog due to the accessibility concerns they present. In event you need it, here's what you can do:",
    { after: nonModalNote },
  ),
};
export const Datalist: Story = {
  render: DialogDatalist,
  parameters: guide(
    "Here's an example of how to compose the dialog component with the `DataList` component.",
  ),
};
export const BackdropBlur: Story = { render: DialogBackdropBlur };
export const FinalFocus: Story = { render: DialogFinalFocus };
