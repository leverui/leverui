import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Heading, HeadingPropsProvider } from '../dist/index.js';
import { renderHeadingCssHydrationTree } from './heading-css-hydration-tree';

/** Hydrate the published Heading against authored CSS on the existing root. */
export function hydrateHeadingCssExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its existing server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Build the same provider and Heading tree used by server rendering. */
  function renderExample(): JSX.Element {
    const tree = renderHeadingCssHydrationTree({ Heading, HeadingPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
