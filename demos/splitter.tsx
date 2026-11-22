import type { Demo, DemoMeta } from './demo-types';
import {
  SplitterBasic,
  SplitterDisabled,
  SplitterExplorerDemo,
  SplitterMultiplePanels,
  SplitterNested,
  SplitterSeparatorOnly,
  SplitterVertical,
} from './examples/splitter-simple';
import {
  SplitterCollapsible,
  SplitterKeyboardResize,
  SplitterResetOnDoubleClick,
  SplitterResponsiveOrientation,
} from './examples/splitter-interactions';
import {
  SplitterControlled,
  SplitterMinMaxConstraints,
  SplitterWithStore,
} from './examples/splitter-sizing';
import { SplitterWithStorage } from './examples/splitter-storage';
import { SplitterResizeEvents } from './examples/splitter-events';
import { SplitterConditionalRendering } from './examples/splitter-conditional';
import { SplitterDynamicPanel } from './examples/splitter-dynamic-panel';
import { SplitterIdeLayout } from './examples/splitter-ide-layout';
import { SplitterCssUnits, SplitterResizeBehavior } from './examples/splitter-units';
import { collapsibleNote, controlledNote, keyboardNote } from './examples/splitter-guide-notes';
import { withComponentInset } from './examples/example-frame';
import './examples/splitter-layout.css';

export const meta = {
  component: SplitterBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description, and any Markdown that follows the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

export const Basic: Story = { render: SplitterBasic };
export const Controlled: Story = {
  render: SplitterControlled,
  parameters: guide(
    'Use `onResize` and `size` props to manage panel sizes programmatically.',
    controlledNote,
  ),
};
export const Store: Story = {
  render: SplitterWithStore,
  parameters: guide(
    'An alternative way to control the splitter is to use the `RootProvider` component and the `useSplitter` store hook. This way you can access the splitter state and methods from outside the splitter.',
  ),
};
export const Vertical: Story = {
  render: SplitterVertical,
  parameters: guide(
    'Pass the `orientation="vertical"` prop to the `Splitter.Root` component for stacked panels that resize vertically.',
  ),
};
export const ResponsiveOrientation: Story = {
  render: SplitterResponsiveOrientation,
  parameters: guide(
    'Use the `useBreakpointValue` hook to change the splitter orientation based on screen size. This example shows a vertical splitter on mobile devices and a horizontal splitter on larger screens.',
  ),
};
export const MultiplePanels: Story = {
  render: SplitterMultiplePanels,
  parameters: guide(
    'Create layouts with more than two resizable panels by passing an array of panels to the `panels` prop of the `Splitter.Root` component.',
  ),
};
export const Collapsible: Story = {
  render: SplitterCollapsible,
  parameters: guide(
    'Make the panels collapsible and snapped to a specific size by setting the `collapsible` and `collapsedSize` properties on a panel in the `panels` array. This allows users to snap panels to a defined minimum size.',
    collapsibleNote,
  ),
};
export const MinMaxConstraints: Story = {
  render: SplitterMinMaxConstraints,
  parameters: guide(
    'Set `minSize` and `maxSize` on panels to constrain their resizable range and prevent resizing beyond these boundaries.',
  ),
};
export const CssUnits: Story = {
  name: 'CssUnits',
  render: SplitterCssUnits,
  parameters: guide(
    'In addition to percentages, `defaultSize`, `minSize`, and `maxSize` accept CSS units like `px`, `em`, `rem`, `vh`, and `vw`. This is useful for panels that should keep a fixed width, such as a navigation sidebar.',
    '> CSS-unit sizes are measured on the client, so panels using them can shift after hydration. Use percentage sizes for a stable server-rendered layout.',
  ),
};
export const ResizeBehavior: Story = {
  name: 'ResizeBehavior',
  render: SplitterResizeBehavior,
  parameters: guide(
    'Set `resizeBehavior` on a panel to control how it reacts when the parent group resizes. Use `"preserve-pixel-size"` to keep a panel\'s pixel size constant (so the other panels absorb the change) instead of scaling proportionally.',
  ),
};
export const Nested: Story = {
  render: SplitterNested,
  parameters: guide(
    "Here's an example of how to nest splitters inside panels to create more complex layouts. Each nested splitter can have its own orientation, sizes, and behaviors independent of the parent splitter.",
  ),
};
export const Storage: Story = {
  render: SplitterWithStorage,
  parameters: guide(
    "Set a `defaultSize` and pair it with a storage solution, such as `localStorage`, to save users' panel size preferences. This ensures that panel layouts persist across sessions. Alternatively, you can use cookies or other storage mechanisms depending on your needs.",
  ),
};
export const Disabled: Story = {
  render: SplitterDisabled,
  parameters: guide(
    'Pass the `disabled` prop to the `Splitter.ResizeTrigger` to disable resize on a panel. This is useful if you want certain panels to remain fixed while allowing others to resize.',
    '```tsx\n<Splitter.ResizeTrigger disabled id="a:b" />\n```',
  ),
};
export const SeparatorOnly: Story = {
  render: SplitterSeparatorOnly,
  parameters: guide(
    'Customize the resize trigger to show only the separator without the indicator. This creates a minimal, clean appearance while maintaining full resize functionality.',
    '```tsx\n<Splitter.ResizeTrigger id="a:b">\n  <Splitter.ResizeTriggerSeparator />\n</Splitter.ResizeTrigger>\n```',
  ),
};
export const ResetOnDoubleClick: Story = {
  render: SplitterResetOnDoubleClick,
  parameters: guide(
    'Use `Splitter.Context` to access the splitter context and add a double-click handler to the resize trigger. This example resets panel sizes to their default values when the resize handle is double-clicked.',
  ),
};
export const ResizeEvents: Story = {
  render: SplitterResizeEvents,
  parameters: guide(
    'Track resize events using `onResizeStart`, `onResize`, and `onResizeEnd` props. This example logs all resize events with timestamps and panel sizes, useful for debugging or implementing custom resize behavior.',
  ),
};
export const KeyboardResize: Story = {
  render: SplitterKeyboardResize,
  parameters: guide(
    'The `Splitter` supports keyboard-based resizing for accessibility and precise control:',
    keyboardNote,
  ),
};
export const ConditionalRendering: Story = {
  render: SplitterConditionalRendering,
  parameters: guide(
    'This example shows a horizontal splitter where panels can be shown or hidden dynamically. Use the buttons above the splitter to toggle the left and right panels - perfect for layouts where certain sections may not always be needed. The splitter automatically adjusts the remaining panels when one is hidden, keeping everything responsive. Initial panel sizes are set with `defaultSize`, and `minSize` ensures panels never shrink too small.',
  ),
};
export const DynamicPanel: Story = {
  render: SplitterDynamicPanel,
  parameters: guide(
    'Add or remove panels dynamically while maintaining relative proportions. This example demonstrates how to manage panel state and redistribute sizes when panels are added or removed.',
  ),
};
export const IdeLayout: Story = {
  render: SplitterIdeLayout,
  parameters: {
    guide: {
      description:
        'A real-world VS Code-like layout demonstrating nested splitters with different orientations, collapsible panels, and integrated code editing.',
    },
  },
};
export const _Explorer: Story = { render: SplitterExplorerDemo };
