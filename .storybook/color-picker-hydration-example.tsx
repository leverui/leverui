import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ColorPicker, Portal } from '../dist/index.js';
import { renderColorPickerHydrationTree } from './color-picker-hydration-tree';

/** Attach the published ColorPicker browser entry to its server markup. */
export function hydrateColorPickerExample(target: HTMLElement): void {
  /** Mark the existing host after Solid attaches its machine handlers. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server tree for Solid's hydration walk. */
  function renderExample(): JSX.Element {
    const tree = renderColorPickerHydrationTree({ ColorPicker, Portal });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
