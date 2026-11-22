import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Box, Input, Listbox, useFilter, useListCollection } from '../dist/index.js';
import { renderListboxExplorer } from './listbox-explorer-tree';

const components = { Box, Input, Listbox, useFilter, useListCollection };

/** Attach the published browser package to server-rendered Explorer options. */
export function hydrateListboxExplorer(target: HTMLElement): void {
  /** Render the matching tree and signal when Solid has attached. */
  function renderGuide(): JSX.Element {
    const tree = renderListboxExplorer(components);
    onSettled(
      /** Let the browser test wait for the completed hydration. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
