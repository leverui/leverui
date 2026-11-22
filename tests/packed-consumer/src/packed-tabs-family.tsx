import {
  Tabs,
  TabsContentGroup,
  TabsPropsProvider,
  useTabs,
  useTabsContext,
} from '@leverui/components';
import type { TabsRootBaseProps } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Render a native section from the installed provider's child-renderer default. */
function renderSection(
  getProps: Parameters<NonNullable<TabsRootBaseProps['asChild']>>[0],
): JSX.Element {
  return <section {...getProps()} />;
}

/** Read the installed machine inside its public context. */
function PackedTabsProbe(): JSX.Element {
  const api = useTabsContext();
  return <output data-testid="packed-family-probe">{api().value}</output>;
}

/** Exercise the installed external machine and both Tabs export forms. */
export function PackedTabsFamily(): JSX.Element {
  const tabs = useTabs({ defaultValue: 'one' });
  return (
    <TabsPropsProvider value={{ size: 'sm', variant: 'enclosed', asChild: renderSection }}>
      <Tabs.RootProvider value={tabs} data-testid="packed-family-root">
        <Tabs.List aria-label="Packed family tabs">
          <Tabs.Trigger value="one" as="a" href="#packed-one" data-testid="packed-family-one">
            One
          </Tabs.Trigger>
          <Tabs.Trigger value="two" data-testid="packed-family-two">
            Two
          </Tabs.Trigger>
        </Tabs.List>
        <TabsContentGroup data-testid="packed-family-group">
          <Tabs.Content value="one" data-testid="packed-family-panel-one">
            First installed panel
          </Tabs.Content>
          <Tabs.Content value="two" data-testid="packed-family-panel-two">
            Second installed panel
          </Tabs.Content>
        </TabsContentGroup>
        <PackedTabsProbe />
      </Tabs.RootProvider>
    </TabsPropsProvider>
  );
}
