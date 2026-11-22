import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Stack, StackSeparator } from '../src';
import { renderStackHydrationTree } from './stack-hydration-tree';

/** Attach browser Stack behavior to the published server nodes. */
export function hydrateStackExample(target: HTMLElement): void {
  /** Record that the browser tree finished attaching. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Render the shared tree through browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderStackHydrationTree({ Stack, StackSeparator });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
