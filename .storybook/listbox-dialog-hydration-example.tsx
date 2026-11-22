import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Button,
  Dialog,
  HStack,
  Kbd,
  Listbox,
  Portal,
  Span,
  useFilter,
  useListCollection,
} from '../dist/index.js';
import { renderListboxDialog } from './listbox-dialog-tree';

const components = {
  Button,
  Dialog,
  HStack,
  Kbd,
  Listbox,
  Portal,
  Span,
  useFilter,
  useListCollection,
};

/** Attach published browser parts to the initially open server Dialog. */
export function hydrateListboxDialog(target: HTMLElement): void {
  /** Render the matching command palette and report attachment. */
  function renderGuide(): JSX.Element {
    const tree = renderListboxDialog(components, { initiallyOpen: true });
    onSettled(
      /** Signal when the nested Listbox is hydrated. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
