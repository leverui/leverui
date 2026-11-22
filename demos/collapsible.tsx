import type { Demo, DemoMeta } from './demo-types';
import {
  CollapsibleInitialOpen,
  CollapsiblePartialHeight,
  CollapsibleWithHideMode,
  CollapsibleWithStore,
} from './examples/collapsible-advanced';
import {
  CollapsibleBasic,
  CollapsibleControlled,
  CollapsibleLazyMounted,
  CollapsibleWithDisabled,
} from './examples/collapsible-standard';
import { withComponentInset } from './examples/example-frame';
import './examples/collapsible-examples.css';

export const meta = {
  component: CollapsibleBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a description and optional Markdown shown after the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: CollapsibleBasic };
export const LazyMounted: Story = {
  name: 'LazyMounted',
  render: CollapsibleLazyMounted,
  parameters: guide('Use the `unmountOnExit` prop to make the content unmount when collapsed.'),
};
export const PartialHeight: Story = {
  name: 'PartialHeight',
  render: CollapsiblePartialHeight,
  parameters: guide(
    'Use the `collapsedHeight` prop to show a preview of the content when collapsed.',
  ),
};
export const InitialOpen: Story = {
  name: 'InitialOpen',
  render: CollapsibleInitialOpen,
  parameters: guide(
    'Use the `defaultOpen` prop to render the collapsible in an open state by default.',
  ),
};
export const Disabled: Story = {
  render: CollapsibleWithDisabled,
  parameters: guide('Use the `disabled` prop to prevent the collapsible from being toggled.'),
};
export const Controlled: Story = {
  render: CollapsibleControlled,
  parameters: guide('Use the `open` and `onOpenChange` props to control the collapsible state.'),
};
export const Store: Story = {
  render: CollapsibleWithStore,
  parameters: guide(
    'An alternative way to control the collapsible is to use the `RootProvider` component and the `useCollapsible` store hook.',
  ),
};
export const HideMode: Story = {
  name: 'HideMode',
  render: CollapsibleWithHideMode,
  parameters: guide(
    'Solid has no `Activity` boundary, so Lever UI has no `hideMode` prop. Collapsed content stays mounted but hidden, and its effects keep running. To pause work while collapsed, read the open state with `Collapsible.Context`, as this counter does.',
    'Use `unmountOnExit` to remove the subtree instead of hiding it.',
  ),
};
