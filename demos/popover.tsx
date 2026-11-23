import type { Demo, DemoMeta } from './demo-types';
import { PopoverForm, PopoverSizeMatrix, PopoverSizes } from './examples/popover-form-and-sizes';
import { PopoverInitialFocus, PopoverOpenFromDialog } from './examples/popover-focus';
import { PopoverMultipleTriggers, PopoverNested } from './examples/popover-interactions';
import { withComponentInset } from './examples/example-frame';
import { PopoverOffset, PopoverPlacement, PopoverSameWidth } from './examples/popover-positioning';
import {
  PopoverBasic,
  PopoverControlled,
  PopoverCustomBg,
  PopoverLazyMounted,
} from './examples/popover-standard';

export const meta = {
  component: PopoverBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach copy and optional follow-up notes to an example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

const unportalledDiff = `\`\`\`diff
-<Portal>
  <Popover.Positioner>
    <Popover.Content>
      {/* ... */}
    </Popover.Content>
  </Popover.Positioner>
-</Portal>
\`\`\``;

const openFromDialogNotes = `${unportalledDiff}

If you have set \`scrollBehavior="inside"\` on the \`Dialog\`, you need to:

- Set the popover positioning to \`fixed\` to avoid the popover from being clipped by the dialog.
- Set \`hideWhenDetached\` to \`true\` to hide the popover when the trigger is scrolled out of view.

\`\`\`tsx
<Popover.Root positioning={{ strategy: 'fixed', hideWhenDetached: true }}>{/* ... */}</Popover.Root>
\`\`\``;

export const Basic: Story = { render: PopoverBasic };
export const Controlled: Story = {
  render: PopoverControlled,
  parameters: guide('Use the `open` and `onOpenChange` to control the visibility of the popover.'),
};
export const MultipleTriggers: Story = {
  render: PopoverMultipleTriggers,
  parameters: guide(
    "Don't mount a popover per button. Put `value` on each `Trigger` under one `Root`. Click another trigger and the same popover moves to it.",
    'Track the active trigger with `triggerValue` and `onTriggerValueChange` on `Root`. If the target is not a button, use `positioning.getAnchorRect`.',
  ),
};
export const Sizes: Story = {
  render: PopoverSizes,
  parameters: guide('Use the `size` prop to change the size of the popover component.'),
};
export const LazyMounted: Story = {
  render: PopoverLazyMounted,
  parameters: guide(
    "Use the `lazyMount` and/or `unmountOnExit` prop to defer the mounting of the popover content until it's opened.",
  ),
};
export const Placement: Story = {
  render: PopoverPlacement,
  parameters: guide(
    'Use the `positioning.placement` prop to configure the underlying `floating-ui` positioning logic.',
  ),
};
export const Offset: Story = {
  render: PopoverOffset,
  parameters: guide(
    'Use the `positioning.offset` prop to adjust the position of the popover content.',
  ),
};
export const SameWidth: Story = {
  render: PopoverSameWidth,
  parameters: guide(
    'Use the `positioning.sameWidth` prop to make the popover content the same width as the trigger.',
  ),
};
export const Nested: Story = {
  render: PopoverNested,
  parameters: guide(
    "When nesting floating elements like popover, select, menu, inside of the popover, avoid portalling them to the document's body.",
    unportalledDiff,
  ),
};
export const InitialFocus: Story = {
  render: PopoverInitialFocus,
  parameters: guide(
    'Use the `initialFocusEl` prop to set the initial focus of the popover content.',
  ),
};
export const Form: Story = {
  render: PopoverForm,
  parameters: guide("Here's an example of a popover with a form inside."),
};
export const CustomBg: Story = {
  render: PopoverCustomBg,
  parameters: guide(
    'Use the `--lui-popover-background` CSS variable to change the background color of the popover content and its arrow.',
  ),
};
export const OpenFromDialog: Story = {
  render: PopoverOpenFromDialog,
  parameters: guide(
    "To use the `Popover` within a `Dialog`, you need to avoid portalling the `Popover.Positioner` to the document's body.",
    openFromDialogNotes,
  ),
};
export const SizeMatrix: Story = { render: PopoverSizeMatrix };
