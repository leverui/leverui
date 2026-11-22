import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { FormatByte, FormatNumber, LocaleProvider } from '../dist/index.js';
import { renderFormatHydrationTree } from './format-hydration-tree';

/** Attach published browser formatters to the published server markup. */
export function hydrateFormatExample(target: HTMLElement): void {
  /** Signal that Solid attached the interactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same formatting tree inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderFormatHydrationTree({ FormatByte, FormatNumber, LocaleProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
