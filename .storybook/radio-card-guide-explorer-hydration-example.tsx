import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { HStack, RadioCard } from '../dist/index.js';
import { renderRadioCardExplorer } from './radio-card-guide-explorer-tree';

const components = { HStack, RadioCard };

/** Attach published browser parts to the server-rendered Explorer cards. */
export function hydrateRadioCardExplorer(target: HTMLElement): void {
  /** Render the matching tree and signal completed attachment. */
  function renderGuide(): JSX.Element {
    const tree = renderRadioCardExplorer(components);
    onSettled(
      /** Let the browser test wait for mounted event handlers. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
