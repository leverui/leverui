import type { Demo, DemoMeta } from './demo-types';
import {
  ToggleTipCloseOnEscape,
  ToggleTipCloseOnInteractOutside,
} from './examples/toggle-tip-behavior';
import {
  ToggleTipArrow,
  ToggleTipBasic,
  ToggleTipInfoTip,
  ToggleTipSizes,
} from './examples/toggle-tip-display';
import { ToggleTipWithParts } from './examples/overlay-parts';
import { withComponentInset } from './examples/example-frame';
import { markdownGuide } from './guide-markdown';

export const meta = {
  component: ToggleTipBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach an optional guide description to one example. */
function guide(description?: string): Story['parameters'] {
  return {
    guide: { ...(description && { description }) },
  };
}

export const Basic: Story = { render: ToggleTipBasic, parameters: guide() };
export const InfoTip: Story = {
  render: ToggleTipInfoTip,
  parameters: markdownGuide(
    guide(
      'Use the `InfoTip` component to display an info tip. This component renders an icon button with an info icon by default.\n\n> Useful for landing pages to display additional information about a feature.',
    ),
  ),
};
export const Sizes: Story = {
  render: ToggleTipSizes,
  parameters: guide(
    'The toggle tip supports `xs`, `sm`, `md`, and `lg` size variants. Pass the `size` prop to both the component and the button to scale it consistently.',
  ),
};
export const Arrow: Story = {
  render: ToggleTipArrow,
  parameters: guide(
    'Set `showArrow` to display a directional arrow pointing from the popover content to the trigger element.',
  ),
};
export const CloseOnEscape: Story = {
  render: ToggleTipCloseOnEscape,
  parameters: guide(
    'By default (`true`), pressing the Escape key closes the toggle tip. Set to `false` to keep it open on Escape.',
  ),
};
export const CloseOnInteractOutside: Story = {
  render: ToggleTipCloseOnInteractOutside,
  parameters: guide(
    'By default (`true`), clicking outside the toggle tip closes it. Set to `false` to allow outside interaction without closing.',
  ),
};
export const WithParts: Story = {
  render: ToggleTipWithParts,
  parameters: guide(
    'Both buttons show the same tip. The first uses the `ToggleTip` shortcut; the second composes the `Popover` parts for full control.',
  ),
};
