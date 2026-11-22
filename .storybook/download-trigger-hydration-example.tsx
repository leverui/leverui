import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { DownloadTrigger } from '../dist/index.js';
import { renderDownloadTriggerHydrationTree } from './download-trigger-hydration-tree';

/** Attach published browser behavior to the server-rendered download button. */
export function hydrateDownloadTriggerExample(target: HTMLElement): void {
  /** Report when Solid has attached the trigger's click handler. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact tree used by the published server renderer. */
  function renderExample(): JSX.Element {
    const tree = renderDownloadTriggerHydrationTree({ DownloadTrigger });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
