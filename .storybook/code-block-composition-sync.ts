import { createSignal, onSettled, type Accessor } from 'solid-js';
import type { TabsValueChangeDetails } from '../src';
import { isCodeLanguage, type CodeLanguage } from './code-block-composition-data';

export interface SyncedCodeLanguage {
  value: Accessor<CodeLanguage>;
  change: (details: TabsValueChangeDetails) => void;
}

/** Keep one tab group synchronized through the application's storage key. */
export function useSyncedCodeLanguage(storageKey: string): SyncedCodeLanguage {
  const [value, setValue] = createSignal<CodeLanguage>('typescript');

  onSettled(
    /** Restore after hydration, then observe changes from other groups or tabs. */
    () => {
      let frame = 0;

      /** Apply a valid selection after the primitive's initial presence state settles. */
      function scheduleSelection(next: string | null): void {
        if (!isCodeLanguage(next)) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(
          /** Update the controlled group without replacing its root. */
          () => setValue(next),
        );
      }

      /** Follow both same-document and cross-tab storage notifications. */
      function handleStorage(event: StorageEvent): void {
        if (event.key === storageKey) scheduleSelection(event.newValue);
      }

      window.addEventListener('storage', handleStorage);
      scheduleSelection(localStorage.getItem(storageKey));
      return (
        /** Release the listener and pending restoration with this group. */
        () => {
          window.removeEventListener('storage', handleStorage);
          cancelAnimationFrame(frame);
        }
      );
    },
  );

  /** Publish a selection for independently mounted groups and browser tabs. */
  function change(details: TabsValueChangeDetails): void {
    if (!isCodeLanguage(details.value)) return;
    setValue(details.value);
    localStorage.setItem(storageKey, details.value);
    window.dispatchEvent(new StorageEvent('storage', { key: storageKey, newValue: details.value }));
  }

  return { value, change };
}
