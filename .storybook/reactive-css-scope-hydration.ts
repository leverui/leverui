import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { Box, Button } from '../src';
import { renderReactiveCssScopeExample } from './reactive-css-scope-example';

/** Hydrate a class-switching CSS theme without replacing its children. */
export function hydrateReactiveCssScopeExample(target: HTMLElement): void {
  /** Mark the tree once Solid attaches its reactive event handler. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server fixture with browser component exports. */
  function renderExample() {
    const tree = renderReactiveCssScopeExample({ Box, Button });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
