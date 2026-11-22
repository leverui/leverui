import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { DatePicker } from '../dist/index.js';
import { renderDatePickerGuideHydrationTree } from './date-picker-guide-hydration-tree';

/** Attach published browser behavior to the server-rendered Jalali grid. */
export function hydrateDatePickerGuideExample(target: HTMLElement): void {
  /** Mark the host only after Solid attaches calendar handlers. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact tree used for published server rendering. */
  function renderExample(): JSX.Element {
    const tree = renderDatePickerGuideHydrationTree({ DatePicker });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
