import type { Demo, DemoMeta } from './demo-types';
import {
  HoverCardOpenFromDialog,
  HoverCardRTL,
  HoverCardWithMultipleTriggers,
} from './examples/hover-card-advanced';
import {
  HoverCardControlled,
  HoverCardWithDelay,
  HoverCardWithPlacement,
} from './examples/hover-card-behavior';
import { HoverCardBasic, HoverCardWithDisabled } from './examples/hover-card-standard';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: HoverCardBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

const openFromDialogNote = `### Open From Dialog

To use the \`HoverCard\` within a \`Dialog\`, you need to avoid portalling the
\`HoverCard.Positioner\` to the document's body.

\`\`\`diff
-<Portal>
  <HoverCard.Positioner>
    <HoverCard.Content>
      {/* ... */}
    </HoverCard.Content>
  </HoverCard.Positioner>
-</Portal>
\`\`\``;

export const Basic: Story = { render: HoverCardBasic };
export const Controlled: Story = {
  render: HoverCardControlled,
  parameters: {
    guide: {
      description: 'Use the `open` and `onOpenChange` to control the visibility of the hover card.',
    },
  },
};
export const MultipleTriggers: Story = {
  render: HoverCardWithMultipleTriggers,
  parameters: {
    guide: {
      description:
        "Don't mount a hover card per link. Put `value` on each `Trigger` under one `Root`. Hover another trigger and the same card moves to it.",
    },
  },
};
export const OpenFromDialog: Story = {
  render: HoverCardOpenFromDialog,
};
export const Delay: Story = {
  render: HoverCardWithDelay,
  parameters: {
    guide: {
      description:
        'Control the open and close delays using the `openDelay` and `closeDelay` props.',
    },
  },
};
export const Placement: Story = {
  render: HoverCardWithPlacement,
  parameters: {
    guide: {
      description:
        'Use the `positioning.placement` prop to configure the underlying `floating-ui` positioning logic.',
    },
  },
};
export const Disabled: Story = {
  render: HoverCardWithDisabled,
  parameters: {
    guide: {
      description: 'Use the `disabled` prop to prevent opening the hover card on interaction.',
      after: openFromDialogNote,
    },
  },
};
export const RTL: Story = { render: HoverCardRTL };
