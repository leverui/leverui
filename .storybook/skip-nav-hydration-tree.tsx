import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { SkipNavContent as ContentExport, SkipNavLink as LinkExport } from '../src';

export interface SkipNavHydrationComponents {
  SkipNavContent: typeof ContentExport;
  SkipNavLink: typeof LinkExport;
}

/** Share one reactive Skip Nav tree between published SSR and browser hydration. */
export function renderSkipNavHydrationTree(components: SkipNavHydrationComponents): JSX.Element {
  const [targetId, setTargetId] = createSignal('hydrated-main');

  /** Change the destination without replacing either native node. */
  function changeTarget(): void {
    setTargetId('updated-main');
  }

  /** Mark the hydrated anchor when its native ref is delivered. */
  function markLinkRef(element: HTMLAnchorElement): void {
    element.dataset.refCalled = 'true';
  }

  /** Mark the hydrated destination when its native ref is delivered. */
  function markContentRef(element: HTMLDivElement): void {
    element.dataset.refCalled = 'true';
  }

  return [
    createComponent(components.SkipNavLink, {
      /** Keep the link's destination reactive after hydration. */
      get id() {
        return targetId();
      },
      'data-testid': 'hydrated-skip-link',
      ref: markLinkRef,
      children: 'Skip to main content',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'hydrated-skip-change',
      onClick: changeTarget,
      children: 'Change target',
    }),
    createComponent(components.SkipNavContent, {
      /** Keep the destination in sync without replacing its node. */
      get id() {
        return targetId();
      },
      'data-testid': 'hydrated-skip-content',
      ref: markContentRef,
      children: 'Main content',
    }),
  ];
}
