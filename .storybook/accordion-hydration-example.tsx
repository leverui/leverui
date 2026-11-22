import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Accordion } from '../src';
import { renderAccordionHydrationTree } from './accordion-hydration-tree';

/** Attach Accordion behavior to the published server tree. */
export function hydrateAccordionExample(target: HTMLElement, initiallyOpen: boolean): void {
  /** Signal completion after Solid reuses the server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same disclosure state inside the hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderAccordionHydrationTree({ Accordion }, initiallyOpen);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
