import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Collapsible as CollapsibleExport, CollapsibleOpenChangeDetails } from '../src';

export type CollapsibleHydrationComponents = {
  Collapsible: typeof CollapsibleExport;
};

/** Build the same controlled Collapsible on the server and in the browser. */
export function renderCollapsibleHydrationTree(
  { Collapsible }: CollapsibleHydrationComponents,
  initiallyOpen: boolean,
): JSX.Element {
  const [open, setOpen] = createSignal(initiallyOpen);

  /** Keep the machine request and external signal synchronized. */
  function changeOpen(details: CollapsibleOpenChangeDetails): void {
    setOpen(details.open);
  }

  return createComponent(Collapsible.Root, {
    /** Read the same controlled state on both rendering paths. */
    get open() {
      return open();
    },
    onOpenChange: changeOpen,
    lazyMount: true,
    unmountOnExit: true,
    'data-testid': 'hydrated-collapsible-root',
    /** Render stable trigger and conditional content within the machine. */
    get children() {
      return [
        createComponent(Collapsible.Trigger, {
          'data-testid': 'hydrated-collapsible-trigger',
          children: 'Toggle hydrated details',
        }),
        createComponent(Collapsible.Content, {
          'data-testid': 'hydrated-collapsible-content',
          children: 'Hydrated details',
        }),
      ];
    },
  });
}
