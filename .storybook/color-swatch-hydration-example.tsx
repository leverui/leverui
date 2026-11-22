import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ColorSwatch, ColorSwatchMix } from '../dist/index.js';
import { renderColorSwatchHydrationTree } from './color-swatch-hydration-tree';

/** Attach Color Swatch behavior to published server markup. */
export function hydrateColorSwatchExample(target: HTMLElement): void {
  /** Mark the host after the shared tree has hydrated. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree in the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderColorSwatchHydrationTree({ ColorSwatch, ColorSwatchMix });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
