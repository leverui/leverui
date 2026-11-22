import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Heading, HeadingPropsProvider } from '../dist/index.js';
import { renderHeadingHydrationTree } from './heading-hydration-tree';

/** Attach the published Heading to markup from the published server entry. */
export function hydrateHeadingExample(target: HTMLElement): void {
  /** Signal that Solid has attached the existing heading tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the provider and heading inside the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderHeadingHydrationTree({ Heading, HeadingPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
