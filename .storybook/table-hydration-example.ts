import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  TableBody,
  TableCell,
  TableRoot,
  TableRootPropsProvider,
  TableRow,
} from '../dist/index.js';
import { renderTableHydrationTree } from './table-hydration-tree';

/** Attach published browser Table parts to matching server markup. */
export function hydrateTableExample(target: HTMLElement): void {
  /** Mark successful client attachment on the host. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared table beneath the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderTableHydrationTree({
      TableRootPropsProvider,
      TableRoot,
      TableBody,
      TableRow,
      TableCell,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
