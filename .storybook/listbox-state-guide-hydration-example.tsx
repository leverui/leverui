import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Code, Listbox, Stack, createListCollection } from '../dist/index.js';
import { renderListboxStateGuide, type ListboxStateGuide } from './listbox-state-guide-tree';

const components = { Code, Listbox, Stack, createListCollection };

/** Attach the published browser package to a preselected server guide. */
export function hydrateListboxStateGuide(target: HTMLElement, guide: ListboxStateGuide): void {
  /** Preserve the server's initial selection and report completed hydration. */
  function renderGuide(): JSX.Element {
    const tree = renderListboxStateGuide(components, guide, ['react']);
    onSettled(
      /** Expose the attachment point to the browser regression. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderGuide, target);
}
