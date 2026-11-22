import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { Box } from '../src';
import { renderSharedStyleExample } from './shared-style-example';
import './hydration-examples.css';

/** Hydrate the shared-rule fixture and mark the mounted tree. */
export function hydrateSharedStyleExample(target: HTMLElement): void {
  /** Mark the existing root once Solid has attached its event handlers. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Build the same siblings and control used by the server. */
  function renderExample() {
    const tree = renderSharedStyleExample({ Box });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
