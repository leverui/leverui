import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Icon, IconPropsProvider, createIcon } from '../dist/index.js';
import { renderIconJsxHydrationTree } from './icon-jsx-hydration-tree';

/** Hydrate the documented JSX Icon from the published browser entry. */
export function hydrateIconJsxExample(target: HTMLElement): void {
  /** Mark the host after the native SVG and path attach. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server's JSX tree under the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderIconJsxHydrationTree({ Icon, IconPropsProvider, createIcon });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
