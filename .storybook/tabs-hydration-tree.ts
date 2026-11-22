import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  TabsContent as ContentExport,
  TabsList as ListExport,
  TabsRoot as RootExport,
  TabsTrigger as TriggerExport,
  TabsValueChangeDetails,
} from '../src';

export type TabsHydrationComponents = {
  TabsRoot: typeof RootExport;
  TabsList: typeof ListExport;
  TabsTrigger: typeof TriggerExport;
  TabsContent: typeof ContentExport;
};

/** Build one controlled Tabs tree for published SSR and browser hydration. */
export function renderTabsHydrationTree({
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
}: TabsHydrationComponents): JSX.Element {
  const [value, setValue] = createSignal('one');

  /** Write the primitive's selected value to the consumer signal. */
  function updateValue(details: TabsValueChangeDetails): void {
    if (details.value !== null) setValue(details.value);
  }

  return createComponent(TabsRoot, {
    /** Read the controlled value whenever the primitive observes the root. */
    get value() {
      return value();
    },
    onValueChange: updateValue,
    size: 'sm' as const,
    variant: { base: 'subtle', md: 'plain' } as const,
    /** Keep list and panels under the same primitive context. */
    get children() {
      return [
        createComponent(TabsList, {
          'aria-label': 'Hydrated tabs',
          /** Create both triggers beneath the primitive's list. */
          get children() {
            return [
              createComponent(TabsTrigger, {
                value: 'one',
                'data-testid': 'hydrated-tab-one',
                children: 'One',
              }),
              createComponent(TabsTrigger, {
                value: 'two',
                'data-testid': 'hydrated-tab-two',
                children: 'Two',
              }),
            ];
          },
        }),
        createComponent(TabsContent, {
          value: 'one',
          'data-testid': 'hydrated-panel-one',
          children: 'First hydrated panel',
        }),
        createComponent(TabsContent, {
          value: 'two',
          'data-testid': 'hydrated-panel-two',
          children: 'Second hydrated panel',
        }),
      ];
    },
  });
}
