import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { FloatingPanelBasic } from './examples/floating-panel-basic-examples';
import { FloatingPanelBoundary } from './examples/floating-panel-boundary-example';
import { FloatingPanelContext } from './examples/floating-panel-context-example';
import { FloatingPanelControlledOpen } from './examples/floating-panel-controlled-open-example';
import {
  FloatingPanelAnchorPosition,
  FloatingPanelDisableDrag,
  FloatingPanelPreventOverflow,
} from './examples/floating-panel-drag-examples';
import { FloatingPanelMinMax } from './examples/floating-panel-min-max-example';
import { FloatingPanelMultiple } from './examples/floating-panel-multiple-example';
import { FloatingPanelOverlay } from './examples/floating-panel-overlay-example';
import { FloatingPanelPosition } from './examples/floating-panel-position-example';
import {
  FloatingPanelDisableResize,
  FloatingPanelResizeAxes,
} from './examples/floating-panel-resize-examples';
import { FloatingPanelRtl } from './examples/floating-panel-rtl-example';
import { FloatingPanelSize } from './examples/floating-panel-size-example';
import { FloatingPanelStages } from './examples/floating-panel-stages-example';
import { FloatingPanelStore } from './examples/floating-panel-store-example';

/** Attach a description, plus any note shown after the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

export const meta = {
  component: FloatingPanelBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

const stageNote = `Here are the available stages:

- **\`default\`** — restore the panel to its normal size and position
- **\`minimized\`** — collapse the panel to a compact height (header only)
- **\`maximized\`** — expand the panel to fill the available boundary

\`\`\`tsx
<FloatingPanel.StageTrigger stage="minimized" />
\`\`\``;

export const Basic: Story = { name: 'Basic', render: FloatingPanelBasic };
export const ControlledOpen: Story = {
  name: 'ControlledOpen',
  render: FloatingPanelControlledOpen,
  parameters: guide(
    'Use the `open` and `onOpenChange` props to control the visibility of the panel.',
  ),
};
export const Store: Story = {
  name: 'Store',
  render: FloatingPanelStore,
  parameters: guide(
    'An alternative way to control the floating panel is to use the `RootProvider` component and the `useFloatingPanel` store hook.',
    'This way you can access the panel state and methods from outside the panel.\n\n> Use `RootProvider + useFloatingPanel` or `Root`, not both.',
  ),
};
export const Stages: Story = {
  name: 'Stages',
  render: FloatingPanelStages,
  parameters: guide(
    'Use the `stage` prop on `FloatingPanel.StageTrigger` to add buttons and minimize, maximum and restore the panel stage.',
    stageNote,
  ),
};
export const Multiple: Story = {
  name: 'Multiple',
  render: FloatingPanelMultiple,
  parameters: guide(
    'Render multiple `FloatingPanel.Root` instances to show several panels at once. Each root manages its own open state, position, and size independently.',
  ),
};
export const Overlay: Story = {
  name: 'Overlay',
  render: FloatingPanelOverlay,
  parameters: guide(
    "Use the `createOverlay` function to open a floating panel programmatically from anywhere in your app. Render the overlay's `Viewport` component and call `.open()` to show the panel.",
  ),
};
export const Context: Story = {
  name: 'Context',
  render: FloatingPanelContext,
  parameters: guide(
    'Use `useFloatingPanelContext` inside the panel to call `minimize`, `maximize`, `restore`, `setPosition`, and `setSize` programmatically.',
  ),
};
export const DisableDrag: Story = {
  name: 'DisableDrag',
  render: FloatingPanelDisableDrag,
  parameters: guide('Set `draggable={false}` to prevent the panel from being moved by the user.'),
};
export const DisableResize: Story = {
  name: 'DisableResize',
  render: FloatingPanelDisableResize,
  parameters: guide('Set `resizable={false}` to prevent the panel from being resized by the user.'),
};
export const ResizeAxes: Story = {
  name: 'ResizeAxes',
  render: FloatingPanelResizeAxes,
  parameters: guide(
    'Pass the `axes` prop to `FloatingPanel.ResizeTriggers` to limit which resize handles are rendered.',
  ),
};
export const MinMax: Story = {
  name: 'MinMax',
  render: FloatingPanelMinMax,
  parameters: guide(
    'Use the `minSize` and `maxSize` props to constrain how small or large the panel can be resized.',
  ),
};
export const AnchorPosition: Story = {
  name: 'AnchorPosition',
  render: FloatingPanelAnchorPosition,
  parameters: guide(
    'Use the `getAnchorPosition` prop to position the panel relative to the trigger element when it opens.',
  ),
};
export const Boundary: Story = {
  name: 'Boundary',
  render: FloatingPanelBoundary,
  parameters: guide(
    'Use `getBoundaryEl` with `allowOverflow={false}` to confine the panel within a specific container.',
  ),
};
export const Position: Story = {
  name: 'Position',
  render: FloatingPanelPosition,
  parameters: guide(
    "Use the `position` and `onPositionChange` props to control the panel's position programmatically.",
  ),
};
export const Size: Story = {
  name: 'Size',
  render: FloatingPanelSize,
  parameters: guide(
    "Use the `size` and `onSizeChange` props to control the panel's dimensions programmatically.",
  ),
};
export const PreventOverflow: Story = {
  name: 'PreventOverflow',
  render: FloatingPanelPreventOverflow,
  parameters: guide(
    'Set `allowOverflow={false}` to prevent the panel from being dragged beyond the viewport edges.',
  ),
};
export const Rtl: Story = {
  name: 'Rtl',
  render: FloatingPanelRtl,
  parameters: guide('Set the `dir="rtl"` prop to support right-to-left layouts.'),
};
