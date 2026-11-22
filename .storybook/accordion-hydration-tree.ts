import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Accordion as AccordionExport } from '../src';

export type AccordionHydrationComponents = {
  Accordion: typeof AccordionExport;
};

/** Build identical open or closed disclosure trees on server and client. */
export function renderAccordionHydrationTree(
  { Accordion }: AccordionHydrationComponents,
  initiallyOpen: boolean,
): JSX.Element {
  return createComponent(Accordion.Root, {
    collapsible: true,
    defaultValue: initiallyOpen ? ['first'] : [],
    lazyMount: true,
    unmountOnExit: true,
    /** Bind a stable item value to the disclosure parts. */
    get children() {
      return createComponent(Accordion.Item, {
        value: 'first',
        /** Keep the trigger and panel beneath their item provider. */
        get children() {
          return [
            createComponent(Accordion.ItemTrigger, {
              'data-testid': 'hydrated-accordion-trigger',
              children: 'Hydrated item',
            }),
            createComponent(Accordion.ItemContent, {
              'data-testid': 'hydrated-accordion-content',
              /** Supply the server-visible body inside the panel. */
              get children() {
                return createComponent(Accordion.ItemBody, {
                  children: 'Hydrated panel',
                });
              },
            }),
          ];
        },
      });
    },
  });
}
