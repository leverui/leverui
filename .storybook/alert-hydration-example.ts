import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Alert, AlertPropsProvider } from '../dist/index.js';
import { renderAlertHydrationTree } from './alert-hydration-tree';

/** Attach the published browser Alert to its existing server markup. */
export function hydrateAlertExample(target: HTMLElement): void {
  /** Mark the host once Solid completes client attachment. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Use the same component tree as the server render. */
  function renderExample(): JSX.Element {
    const tree = renderAlertHydrationTree({ Alert, AlertPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
