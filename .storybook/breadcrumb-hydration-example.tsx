import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../dist/components/breadcrumb-parts.js';
import { BreadcrumbRoot } from '../dist/components/breadcrumb-root.js';
import { renderBreadcrumbHydrationTree } from './breadcrumb-hydration-tree';

/** Attach the published Breadcrumb client entry to server-rendered markup. */
export function hydrateBreadcrumbExample(target: HTMLElement): void {
  /** Signal completion after Solid has attached to the server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same tree inside the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderBreadcrumbHydrationTree({
      BreadcrumbCurrentLink,
      BreadcrumbItem,
      BreadcrumbLink,
      BreadcrumbList,
      BreadcrumbRoot,
      BreadcrumbSeparator,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
