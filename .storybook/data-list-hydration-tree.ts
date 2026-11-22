import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { DataListItem as ItemExport } from '../src/components/data-list-item';
import type { DataListItemLabel as LabelExport } from '../src/components/data-list-item-label';
import type { DataListItemValue as ValueExport } from '../src/components/data-list-item-value';
import type { DataListRoot as RootExport } from '../src/components/data-list-root';

export interface DataListHydrationComponents {
  DataListRoot: typeof RootExport;
  DataListItem: typeof ItemExport;
  DataListItemLabel: typeof LabelExport;
  DataListItemValue: typeof ValueExport;
}

/** Build matching server and browser Data List trees with live content. */
export function renderDataListHydrationTree({
  DataListRoot,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
}: DataListHydrationComponents): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Change the list layout and description after hydration. */
  function toggleDetails(): void {
    setChanged(!changed());
  }

  return [
    createComponent(DataListRoot, {
      id: 'hydrated-data-list',
      /** Keep orientation bound to the shared signal. */
      get orientation() {
        return changed() ? ('horizontal' as const) : ('vertical' as const);
      },
      /** Construct the semantic item inside its root context. */
      get children() {
        return createComponent(DataListItem, {
          id: 'hydrated-data-list-item',
          /** Place a term and description inside one item. */
          get children() {
            return [
              createComponent(DataListItemLabel, { children: 'Status' }),
              createComponent(DataListItemValue, {
                id: 'hydrated-data-list-value',
                /** Update text on the existing description node. */
                get children() {
                  return changed() ? 'Complete' : 'Pending';
                },
              }),
            ];
          },
        });
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'data-list-hydration-toggle',
      type: 'button',
      onClick: toggleDetails,
      children: 'Change details',
    }),
  ];
}
