import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Input,
  Listbox,
  Text,
  createListCollection,
  useFilter,
  useListCollection,
} from '../dist/index.js';
import { renderFilterTree, renderKeyboardPriorityTree } from './listbox-input-tree';

type InputVariant = 'filter' | 'keyboard-priority';
const components = {
  Input,
  Listbox,
  Text,
  createListCollection,
  useFilter,
  useListCollection,
};

/** Hydrate the same guide tree using the published browser entry. */
export function hydrateListboxInput(target: HTMLElement, variant: InputVariant): void {
  /** Mark completion only after Solid attaches the published composition. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server-rendered collection and input variant. */
  function renderExample(): JSX.Element {
    const tree =
      variant === 'filter' ? renderFilterTree(components) : renderKeyboardPriorityTree(components);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
