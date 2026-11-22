import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  TagCloseTrigger,
  TagEndElement,
  TagLabel,
  TagRoot,
  TagRootPropsProvider,
} from '../dist/index.js';
import { renderTagHydrationTree } from './tag-hydration-tree';

/** Attach published browser Tag parts to matching server markup. */
export function hydrateTagExample(target: HTMLElement): void {
  /** Mark successful client attachment on the host. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same Tag tree beneath the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderTagHydrationTree({
      TagRootPropsProvider,
      TagRoot,
      TagLabel,
      TagEndElement,
      TagCloseTrigger,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
