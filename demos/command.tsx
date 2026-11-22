import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { CommandInlineExample } from './examples/command-inline-example';
import { CommandBasicExample } from './examples/command-basic-example';
import { CommandControlledSearchExample } from './examples/command-controlled-search';
import { CommandGroupsExample } from './examples/command-groups-example';
import { CommandKeywordsExample } from './examples/command-keywords-example';
import { CommandSizesExample } from './examples/command-sizes-example';
import { CommandMultipleExample } from './examples/command-multiple-example';
import { CommandFooterActionsExample } from './examples/command-footer-actions-example';
import { CommandEmptyStateExample } from './examples/command-empty-state-example';
import { CommandRootProviderExample } from './examples/command-root-provider-example';
import { CommandTabsExample } from './examples/command-tabs-example';
import { CommandPrefixSearchExample } from './examples/command-prefix-search-example';
import { CommandRecentExample } from './examples/command-recent-example';
import { CommandInputPageExample } from './examples/command-input-page-example';
import { CommandAsyncContentExample } from './examples/command-async-content-example';
import { CommandLoadMoreExample } from './examples/command-load-more-example';
import { CommandAsyncPagesExample } from './examples/command-async-pages-example';
import { CommandVirtualizedExample } from './examples/command-virtualized-example';
import { CommandHotkeysExample } from './examples/command-hotkeys-example';
import { CommandNestedExample } from './examples/command-nested-example';
import { CommandLinksStory } from './examples/command-links';
import { guide } from './command-guide-copy';

export const meta = {
  component: CommandInlineExample,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { name: 'Basic', render: CommandBasicExample };
export const Inline: Story = { name: 'Inline', parameters: guide.inline };
export const Groups: Story = {
  name: 'Groups',
  render: CommandGroupsExample,
  parameters: guide.groups,
};
export const Keywords: Story = {
  name: 'Keywords',
  render: CommandKeywordsExample,
  parameters: guide.keywords,
};
export const ControlledSearch: Story = {
  name: 'ControlledSearch',
  render: CommandControlledSearchExample,
  parameters: guide.controlledSearch,
};
export const PrefixSearch: Story = {
  name: 'PrefixSearch',
  render: CommandPrefixSearchExample,
  parameters: guide.prefixSearch,
};
export const Tabs: Story = { name: 'Tabs', render: CommandTabsExample, parameters: guide.tabs };
export const AsyncContent: Story = {
  name: 'AsyncContent',
  render: CommandAsyncContentExample,
  parameters: guide.asyncContent,
};
export const LoadMore: Story = {
  name: 'LoadMore',
  render: CommandLoadMoreExample,
  parameters: guide.loadMore,
};
export const NestedPages: Story = {
  name: 'NestedPages',
  render: CommandNestedExample,
  parameters: guide.nested,
};
export const AsyncPages: Story = {
  name: 'AsyncPages',
  render: CommandAsyncPagesExample,
  parameters: guide.asyncPages,
};
export const InputPage: Story = {
  name: 'InputPage',
  render: CommandInputPageExample,
  parameters: guide.inputPage,
};
export const Hotkeys: Story = {
  name: 'Hotkeys',
  render: CommandHotkeysExample,
  parameters: guide.hotkeys,
};
export const RootProvider: Story = {
  name: 'RootProvider',
  render: CommandRootProviderExample,
  parameters: guide.store,
};
export const Links: Story = { name: 'Links', render: CommandLinksStory, parameters: guide.links };
export const RecentCommands: Story = {
  name: 'RecentCommands',
  render: CommandRecentExample,
  parameters: guide.recent,
};
export const Multiple: Story = {
  name: 'Multiple',
  render: CommandMultipleExample,
  parameters: guide.toggleItems,
};
export const FooterActions: Story = {
  name: 'FooterActions',
  render: CommandFooterActionsExample,
  parameters: guide.footerActions,
};
export const EmptyState: Story = {
  name: 'EmptyState',
  render: CommandEmptyStateExample,
  parameters: guide.emptyState,
};
export const Virtualized: Story = {
  name: 'Virtualized',
  render: CommandVirtualizedExample,
  parameters: guide.virtualized,
};
export const Sizes: Story = { name: 'Sizes', render: CommandSizesExample, parameters: guide.sizes };
