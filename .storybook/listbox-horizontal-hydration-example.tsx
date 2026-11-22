import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Image, Listbox, Stack, Text, createListCollection } from '../dist/index.js';
import { selectedHorizontalAlbum } from '../demos/listbox-horizontal-data';
import { renderHorizontalListbox } from './listbox-horizontal-tree';

const components = { Image, Listbox, Stack, Text, createListCollection };

/** Attach the published browser package to the selected server album card. */
export function hydrateHorizontalListbox(target: HTMLElement): void {
  /** Recreate the same selected tree and expose attachment completion. */
  function renderGuide(): JSX.Element {
    const tree = renderHorizontalListbox(components, [selectedHorizontalAlbum]);
    onSettled(
      /** Tell the browser check that Solid attached to the server nodes. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
