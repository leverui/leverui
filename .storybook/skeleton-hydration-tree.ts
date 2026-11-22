import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Skeleton as SkeletonExport, SkeletonText as SkeletonTextExport } from '../src';

export interface SkeletonHydrationComponents {
  Skeleton: typeof SkeletonExport;
  SkeletonText: typeof SkeletonTextExport;
}

/** Build matching server and browser placeholder trees around one signal. */
export function renderSkeletonHydrationTree({
  Skeleton,
  SkeletonText,
}: SkeletonHydrationComponents): JSX.Element {
  const [loading, setLoading] = createSignal(true);

  /** Reveal both placeholders after the browser attaches. */
  function revealContent(): void {
    setLoading(false);
  }

  return [
    createComponent(Skeleton, {
      id: 'hydrated-skeleton',
      /** Follow the current loading state. */
      get loading() {
        return loading();
      },
      children: 'Hydrated content',
    }),
    createComponent(SkeletonText, {
      noOfLines: 2,
      rootProps: { id: 'hydrated-skeleton-text' },
      /** Follow the same loading state for line count. */
      get loading() {
        return loading();
      },
      children: 'Finished text',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'skeleton-hydration-toggle',
      type: 'button',
      onClick: revealContent,
      children: 'Reveal content',
    }),
  ];
}
