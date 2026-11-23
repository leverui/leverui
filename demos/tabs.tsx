import type { Demo, DemoMeta } from './demo-types';
import './examples/tabs-examples.css';
import { TabsAnimation } from './examples/tabs-animation';
import { TabsControlled, TabsFitted, TabsLinks, TabsNested } from './examples/tabs-basic';
import { withComponentInset } from './examples/example-frame';
import { TabsCustomIndicator, TabsIndicator } from './examples/tabs-indicator';
import { TabsResponsiveOrientation, TabsVertical, TabsWithVariants } from './examples/tabs-layout';
import { TabsLazyMounted } from './examples/tabs-lifecycle';
import { TabsSizes, TabsVariants } from './examples/tabs-matrices';
import { TabsBasic, TabsDisabledTab, TabsManualActivation } from './examples/tabs-standard';
import { TabsDynamicAdd, TabsStore } from './examples/tabs-state';

export const meta = {
  component: TabsBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

const routerNote = `When using custom router links, you need to set the \`navigate\` prop on the \`Tabs.Root\` component.

\`\`\`tsx
import { Tabs } from '@leverui/components';
import { useNavigate } from '@solidjs/router';

/** Send each tab change through the application router. */
function Demo() {
  const navigate = useNavigate();
  return <Tabs.Root navigate={({ value }) => navigate(\`/\${value}\`)}>{/* ... */}</Tabs.Root>;
}
\`\`\``;

/** Attach a description and optional following Markdown. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after && { after }) } };
}

export const Basic: Story = { render: TabsBasic };
export const Variants: Story = {
  render: TabsWithVariants,
  parameters: {
    guide: {
      description: 'Use the `variant` prop to change the visual style of the tabs.',
    },
  },
};
export const LazyMounted: Story = {
  render: TabsLazyMounted,
  parameters: guide(
    'Use the `lazyMount` and/or `unmountOnExit` prop to only render the tab content when it is active. This can be useful for performance optimization.',
  ),
};
export const Indicator: Story = {
  render: TabsIndicator,
  parameters: guide(
    'Render the `Tabs.Indicator` component to display a visual indicator of the active tab.',
  ),
};
export const CustomIndicator: Story = {
  render: TabsCustomIndicator,
  parameters: guide(
    'Customize the indicator appearance using CSS variables like `--lui-tabs-indicator-bg` and `--lui-tabs-indicator-shadow`.',
  ),
};
export const Links: Story = {
  render: TabsLinks,
  parameters: guide(
    'Pass the `asChild` to the `Tabs.Trigger` component to render a link as a tab. When a tab is clicked, the link will be navigated to.',
    routerNote,
  ),
};
export const Fitted: Story = {
  render: TabsFitted,
  parameters: guide('Use the `fitted` prop to make the tabs fit the width of the container.'),
};
export const Controlled: Story = {
  render: TabsControlled,
  parameters: guide('Use the `value` and `onValueChange` prop to control the active tab.'),
};
export const Store: Story = {
  render: TabsStore,
  parameters: guide(
    'An alternative way to control the tabs is to use the `RootProvider` component and the `useTabs` store function. This way you can access the tabs state and methods from outside the tabs.',
  ),
};
export const DisabledTab: Story = {
  render: TabsDisabledTab,
  parameters: guide('Set the `disabled` prop on the `Tabs.Trigger` component to disable a tab.'),
};
export const ManualActivation: Story = {
  render: TabsManualActivation,
  parameters: guide(
    'By default, the tabs are selected when the arrow keys are pressed. Disable this behavior by setting the `activationMode` prop to `manual`. In this mode, the tabs will only be selected when clicked or the enter key is pressed.',
  ),
};
export const DynamicAdd: Story = {
  render: TabsDynamicAdd,
  parameters: guide("Here's an example of how to dynamically add and remove tabs."),
};
export const ResponsiveOrientation: Story = {
  render: TabsResponsiveOrientation,
  parameters: guide(
    'Responsive values are not supported for the `orientation` prop because it affects keyboard navigation and `aria-orientation` behavior, not just styling. The orientation changes how arrow keys work (horizontal uses left/right, vertical uses up/down). To achieve responsive orientation, use the `useBreakpointValue` function to change the orientation based on the screen size.',
  ),
};
export const WithAnimation: Story = {
  render: TabsAnimation,
  parameters: {
    guide: {
      description: 'Use the `data-state` attribute in CSS to animate the tabs.',
    },
  },
};
export const Nested: Story = { render: TabsNested };
export const Vertical: Story = { render: TabsVertical };
export const SizeMatrix: Story = { render: TabsSizes };
export const VariantMatrix: Story = { render: TabsVariants };
