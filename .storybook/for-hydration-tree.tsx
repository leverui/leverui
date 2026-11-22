import { createComponent, createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { For as ForExport } from '../src';

type ForHydrationComponents = { For: typeof ForExport };

/** Build the same list tree for published SSR and browser hydration. */
export function renderForHydrationTree({ For }: ForHydrationComponents): JSX.Element {
  const [items, setItems] = createSignal<readonly string[]>([]);
  const [initialItems, setInitialItems] = createSignal<readonly string[]>(['Alpha', 'Beta']);

  /** Replace the empty fallback with the list after hydration. */
  function revealItems(): void {
    setItems(['One', 'Two']);
  }

  /** Reorder server-rendered items after hydration. */
  function reverseInitialItems(): void {
    setInitialItems(
      /** Reverse the same server-rendered item values after hydration. */
      (current) => current.slice().reverse(),
    );
  }

  /** Render one item with its current Solid index. */
  function renderItem(item: string, index: Accessor<number>): JSX.Element {
    return createComponent(Dynamic, {
      component: 'li',
      'data-testid': `hydrated-for-${item.toLowerCase()}`,
      /** Reflect the current position after list updates. */
      get children() {
        return `${index()}: ${item}`;
      },
    });
  }

  return createComponent(Dynamic, {
    component: 'section',
    'data-testid': 'for-hydration-tree',
    /** Keep the stable sibling beside the changing list. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'span',
          'data-testid': 'for-hydration-stable',
          children: 'Stable sibling',
        }),
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'for-hydration-reveal',
          onClick: revealItems,
          children: 'Reveal items',
        }),
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'for-hydration-reverse',
          onClick: reverseInitialItems,
          children: 'Reverse initial items',
        }),
        createComponent(Dynamic, {
          component: 'ul',
          /** Render the keyed list without a wrapper inside the native list. */
          get children() {
            return createComponent(For, {
              /** Read the current collection after hydration. */
              get each() {
                return items();
              },
              fallback: createComponent(Dynamic, {
                component: 'li',
                'data-testid': 'for-hydration-fallback',
                children: 'No items',
              }),
              children: renderItem,
            });
          },
        }),
        createComponent(Dynamic, {
          component: 'ul',
          'data-testid': 'for-hydration-initial-list',
          /** Hydrate populated server items before testing a reorder. */
          get children() {
            return createComponent(For, {
              /** Track the populated list across hydration and reorder. */
              get each() {
                return initialItems();
              },
              children: renderItem,
            });
          },
        }),
      ];
    },
  });
}
