import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { Box } from '../src';
import { renderCssScopeDisposalExample } from './css-scope-disposal-example';

/** Hydrate two removable CSS scopes using the browser package export. */
export function hydrateCssScopeDisposalExample(target: HTMLElement): void {
  /** Mark when Solid has attached the removal buttons. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server fixture with the matching scope hierarchy. */
  function renderExample() {
    const tree = renderCssScopeDisposalExample({ Box });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
