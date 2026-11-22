import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Listbox, createListCollection } from '../dist/index.js';
import { selectedCollectionValues } from './listbox-collection-guide-data';
import {
  renderListboxCollectionGuide,
  type ListboxCollectionGuide,
} from './listbox-collection-guide-tree';

const components = { Listbox, createListCollection };

/** Attach one published browser guide to its preselected server markup. */
export function hydrateListboxCollectionGuide(
  target: HTMLElement,
  guide: ListboxCollectionGuide,
): void {
  /** Render the same initial selection and mark attachment completion. */
  function renderGuide(): JSX.Element {
    const tree = renderListboxCollectionGuide(components, guide, selectedCollectionValues[guide]);
    onSettled(
      /** Tell the browser regression that Solid attached its event handlers. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
