import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { DatePicker } from '../dist/index.js';
import { renderDatePickerHydrationTree } from './date-picker-hydration-tree';

/** Attach the published browser DatePicker to its server-rendered calendar. */
export function hydrateDatePickerExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches the calendar's event handlers. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate exactly the shared server tree for Solid's hydration walk. */
  function renderExample(): JSX.Element {
    const tree = renderDatePickerHydrationTree({ DatePicker });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
