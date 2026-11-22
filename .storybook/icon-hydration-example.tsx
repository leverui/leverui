import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Icon, IconPropsProvider, createIcon } from '../dist/index.js';
import {
  renderIconHydrationTree,
  renderProviderIconHydrationTree,
  renderSimpleIconHydrationTree,
} from './icon-hydration-tree';

/** Hydrate one plain published SVG without additional composition. */
export function hydrateSimpleIconExample(target: HTMLElement): void {
  /** Mark the host when the plain Icon has hydrated. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the plain server tree under the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderSimpleIconHydrationTree({ Icon, IconPropsProvider, createIcon });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}

/** Hydrate a provider-owned SVG and its native path. */
export function hydrateProviderIconExample(target: HTMLElement): void {
  /** Mark the host after the provider-owned Icon has hydrated. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the nested server tree under the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderProviderIconHydrationTree({
      Icon,
      IconPropsProvider,
      createIcon,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}

/** Attach published Icon behavior to matching server-rendered SVG nodes. */
export function hydrateIconExample(target: HTMLElement): void {
  /** Mark the host after the shared Icon tree has hydrated. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree under Solid's hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderIconHydrationTree({ Icon, IconPropsProvider, createIcon });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
