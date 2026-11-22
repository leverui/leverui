import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { EnvironmentProvider, Portal, useEnvironmentContext } from '../src';
import { renderEnvironmentHydrationTree } from './environment-hydration-tree';

/** Hydrate the environment tree through the browser source exports. */
export function hydrateEnvironmentExample(target: HTMLElement): void {
  /** Mark completion of the first browser hydration pass. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the published server tree before mount callbacks run. */
  function renderExample(): JSX.Element {
    const tree = renderEnvironmentHydrationTree({
      EnvironmentProvider,
      Portal,
      useEnvironmentContext,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
