import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { Box } from '../src';
import { renderConsumerSpacingExample } from './consumer-spacing-example';
import './consumer-spacing-example.css';

/** Hydrate a provider-free Box with a reactive consumer CSS choice. */
export function hydrateConsumerSpacingExample(target: HTMLElement): void {
  /** Mark the container after Solid attaches to server markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same native Box tree used by the server. */
  function renderExample() {
    const tree = renderConsumerSpacingExample({ Box });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
