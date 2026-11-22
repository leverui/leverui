import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Slider } from '../dist/index.js';
import { renderSliderHydrationTree } from './slider-hydration-tree';

/** Attach the published browser Slider API to the shared server tree. */
export function hydrateSliderExample(target: HTMLElement): void {
  /** Mark the host once Solid attaches its reactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same JSX used by the server renderer. */
  function renderExample(): JSX.Element {
    const tree = renderSliderHydrationTree({ Slider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
