import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Box, Checkmark, Flex, Kbd, Listbox, createListCollection } from '../dist/index.js';
import { renderExtendedGuide, renderSelectAllGuide } from './listbox-guide-tree';

const components = { Box, Checkmark, Flex, Kbd, Listbox, createListCollection };

/** Attach the published browser parts to one server-rendered guide. */
export function hydrateListboxGuide(target: HTMLElement, guide: 'select-all' | 'extended'): void {
  /** Mark hydration after Solid attaches to the retained server nodes. */
  function renderGuide(): JSX.Element {
    const tree =
      guide === 'select-all'
        ? renderSelectAllGuide(components, ['react'])
        : renderExtendedGuide(components);
    onSettled(
      /** Expose attachment for the focused browser test. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
