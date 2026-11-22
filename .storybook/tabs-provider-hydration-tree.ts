import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  TabsContent as ContentExport,
  TabsContentGroup as GroupExport,
  TabsList as ListExport,
  TabsRootProvider as RootProviderExport,
  TabsTrigger as TriggerExport,
  useTabs as UseTabsExport,
} from '../src';

export type TabsProviderHydrationComponents = {
  TabsRootProvider: typeof RootProviderExport;
  TabsList: typeof ListExport;
  TabsTrigger: typeof TriggerExport;
  TabsContentGroup: typeof GroupExport;
  TabsContent: typeof ContentExport;
  useTabs: typeof UseTabsExport;
};

/** Build the same external-machine Tabs tree for server and browser renders. */
export function renderTabsProviderHydrationTree(
  components: TabsProviderHydrationComponents,
): JSX.Element {
  /** Create the primitive's machine after the Lever UI provider context is established. */
  function renderProviderTabs(): JSX.Element {
    const tabs = components.useTabs({ defaultValue: 'one' });
    return createComponent(components.TabsRootProvider, {
      value: tabs,
      size: 'sm' as const,
      'data-testid': 'provider-hydrated-root',
      /** Render list and grouped panels in the external machine context. */
      get children(): JSX.Element {
        return [
          createComponent(components.TabsList, {
            'aria-label': 'Provider hydrated tabs',
            /** Keep triggers under their list context. */
            get children(): JSX.Element {
              return [
                createComponent(components.TabsTrigger, {
                  value: 'one',
                  'data-testid': 'provider-hydrated-tab-one',
                  children: 'One',
                }),
                createComponent(components.TabsTrigger, {
                  value: 'two',
                  'data-testid': 'provider-hydrated-tab-two',
                  children: 'Two',
                }),
              ];
            },
          }),
          createComponent(components.TabsContentGroup, {
            'data-testid': 'provider-hydrated-group',
            /** Associate the selected panel with its trigger. */
            get children(): JSX.Element {
              return [
                createComponent(components.TabsContent, {
                  value: 'one',
                  'data-testid': 'provider-hydrated-panel-one',
                  children: 'First provider panel',
                }),
                createComponent(components.TabsContent, {
                  value: 'two',
                  'data-testid': 'provider-hydrated-panel-two',
                  children: 'Second provider panel',
                }),
              ];
            },
          }),
        ];
      },
    });
  }

  return createComponent(renderProviderTabs, {});
}
