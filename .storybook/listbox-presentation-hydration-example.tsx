import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Box, Checkmark, Listbox, Text, createListCollection } from '../dist/index.js';
import {
  renderCheckmarkTree,
  renderDescriptionTree,
  renderIconTree,
} from './listbox-presentation-tree';

type PresentationVariant = 'checkmark' | 'description' | 'icon';
const components = { Box, Checkmark, Listbox, Text, createListCollection };

/** Hydrate the published browser package over the matching server tree. */
export function hydrateListboxPresentation(
  target: HTMLElement,
  variant: PresentationVariant,
  initialSelection: readonly string[] = [],
): void {
  /** Mark completion only after Solid attaches the published composition. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same collection and variant rendered on the server. */
  function renderExample(): JSX.Element {
    const tree = renderVariant();
    onSettled(markHydrated);
    return tree;
  }

  /** Build the requested presentation tree before scheduling the hydration signal. */
  function renderVariant(): JSX.Element {
    switch (variant) {
      case 'checkmark':
        return renderCheckmarkTree(components, initialSelection);
      case 'description':
        return renderDescriptionTree(components, initialSelection);
      case 'icon':
        return renderIconTree(components, initialSelection);
    }
  }

  hydrate(renderExample, target);
}
