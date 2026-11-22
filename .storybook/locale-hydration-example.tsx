import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { LocaleProvider, useFilter, useLocaleContext } from '../src';
import { renderLocaleHydrationTree } from './locale-hydration-tree';

/** Hydrate the published locale tree through browser exports. */
export function hydrateLocaleExample(target: HTMLElement): void {
  /** Mark completion of the first hydration pass. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Reconstruct the server tree before mounted callbacks run. */
  function renderExample(): JSX.Element {
    const tree = renderLocaleHydrationTree({ LocaleProvider, useFilter, useLocaleContext });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
