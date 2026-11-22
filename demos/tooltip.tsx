import type { Demo, DemoMeta } from './demo-types';
import { TooltipControlled, TooltipControlledMultiple } from './examples/tooltip-controlled';
import { TooltipWithDialog } from './examples/tooltip-dialog';
import { TooltipWithParts } from './examples/overlay-parts';
import {
  TooltipWithAvatar,
  TooltipWithCheckbox,
  TooltipWithSwitch,
} from './examples/tooltip-element-triggers';
import { TooltipWithMenuItem, TooltipWithMenuTrigger } from './examples/tooltip-menu';
import {
  TooltipMultiple,
  TooltipWithDelay,
  TooltipWithInteractive,
  TooltipWithOffset,
  TooltipWithPlacement,
} from './examples/tooltip-options';
import {
  TooltipBasic,
  TooltipWithArrow,
  TooltipWithCustomBg,
  TooltipWithDisabled,
} from './examples/tooltip-standard';
import { TooltipWithStore } from './examples/tooltip-store';
import { TooltipWithTab } from './examples/tooltip-tabs';
import { withComponentInset } from './examples/example-frame';
import { markdownGuide } from './guide-markdown';

export const meta = {
  component: TooltipBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the guide description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: TooltipBasic };
export const Arrow: Story = {
  render: TooltipWithArrow,
  parameters: guide('Use the `showArrow` prop to show an arrow on the tooltip.'),
};
export const Placement: Story = {
  render: TooltipWithPlacement,
  parameters: guide('Use the `positioning.placement` prop to change the position of the tooltip.'),
};
export const Offset: Story = {
  render: TooltipWithOffset,
  parameters: guide('Use the `positioning.offset` prop to change the offset of the tooltip.'),
};
export const Delay: Story = {
  render: TooltipWithDelay,
  parameters: guide(
    'Use the `openDelay` and `closeDelay` prop to change the delay of the tooltip.',
  ),
};
export const CustomBg: Story = {
  render: TooltipWithCustomBg,
  parameters: guide(
    'Use the `--leverui-tooltip-background` CSS variable to change the background color of the tooltip.',
  ),
};
export const Controlled: Story = {
  render: TooltipControlled,
  parameters: guide(
    'Use the `open` and `onOpenChange` prop to control the visibility of the tooltip.',
  ),
};
export const WithStore: Story = {
  render: TooltipWithStore,
  parameters: markdownGuide(
    guide(
      'An alternative way to control the tooltip is to use the `RootProvider` component and the `useTooltip` store hook.\n\nThis way you can access the tooltip state and methods from outside the tooltip.',
    ),
  ),
};
export const Interactive: Story = {
  render: TooltipWithInteractive,
  parameters: guide(
    'Use the `interactive` prop to keep the tooltip open when interacting with its content.',
  ),
};
export const Disabled: Story = {
  render: TooltipWithDisabled,
  parameters: guide(
    'Use the `disabled` prop to disable the tooltip. When disabled, the tooltip will not be shown.',
  ),
};
export const WithAvatar: Story = {
  render: TooltipWithAvatar,
  parameters: guide(
    "Here's an example of how to use the `Tooltip` component with an `Avatar` component.",
  ),
};
export const WithCheckbox: Story = {
  render: TooltipWithCheckbox,
  parameters: guide(
    "Here's an example of how to use the `Tooltip` component with a `Checkbox` component.",
  ),
};
export const WithMenuItem: Story = {
  render: TooltipWithMenuItem,
  parameters: guide("Here's an example of how to use the `Tooltip` with a `MenuItem` component."),
};
export const WithMenuTrigger: Story = {
  render: TooltipWithMenuTrigger,
  parameters: guide(
    "Here's an example of how to use the `Tooltip` with a `MenuTrigger` component.",
  ),
};
export const WithSwitch: Story = {
  render: TooltipWithSwitch,
  parameters: guide("Here's an example of how to wrap `Tooltip` around a `Switch` component."),
};
export const WithTab: Story = {
  render: TooltipWithTab,
  parameters: guide("Here's an example of how to wrap `Tooltip` around a `Tabs` component."),
};
export const WithParts: Story = {
  render: TooltipWithParts,
  parameters: guide(
    'Both buttons show the same tooltip. The first uses the `Tooltip` shortcut; the second composes `Tooltip.Root`, `Tooltip.Trigger`, `Tooltip.Positioner`, and `Tooltip.Content` for full control.',
  ),
};
export const ControlledMultiple: Story = { render: TooltipControlledMultiple };
export const Multiple: Story = { render: TooltipMultiple };
export const WithDialog: Story = { render: TooltipWithDialog };
