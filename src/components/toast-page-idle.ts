import type { CreateToasterReturn } from './toast-store';
import { observeToastPauseCalls, type ToastPauseAction } from './toast-pause-calls';

interface StoreChange {
  id: string;
  paused?: boolean;
  dismiss?: boolean;
}

/** Zag 2 marks a paused toast with `paused: true`. */
function isPausedItem(item: object): boolean {
  return 'paused' in item && item.paused === true;
}

/** Narrow Zag's loosely typed subscription payload to a toast change. */
function isStoreChange(value: unknown): value is StoreChange {
  return (
    typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string'
  );
}

/** Preserve distinct page-idle pause ownership across Zag visibility changes. */
export function trackToastPageIdle<T>(
  store: CreateToasterReturn<T>,
  ownerDocument: Document,
): () => void {
  const visibilityOwned = new Set<string>();
  const externalPaused = new Set<string>();
  const pending = new Set<string>();
  let active = true;
  let publishing = false;

  /** Keep this listener's store messages separate from consumer messages. */
  function sendOwnMessage(id: string, action: 'pause' | 'resume'): void {
    publishing = true;
    try {
      store[action](id);
    } finally {
      publishing = false;
    }
  }

  /** Pause one toast only when another source has not already paused it. */
  function pauseForVisibility(id: string): void {
    if (!store.isVisible(id) || visibilityOwned.has(id) || externalPaused.has(id)) return;
    for (const item of store.getVisibleToasts()) {
      if (item.id === id && isPausedItem(item)) return;
    }
    visibilityOwned.add(id);
    sendOwnMessage(id, 'pause');
  }

  /** Preserve consumer and primitive pause reasons independently of payload updates. */
  function onPauseCall(action: ToastPauseAction, id?: string): void {
    if (publishing) return;
    const ids: string[] = [];
    if (id) {
      if (store.isVisible(id)) ids.push(id);
    } else {
      for (const item of store.getVisibleToasts()) {
        if (typeof item.id === 'string') ids.push(item.id);
      }
    }
    for (const toastId of ids) {
      if (action === 'pause') {
        externalPaused.add(toastId);
        visibilityOwned.delete(toastId);
      } else {
        externalPaused.delete(toastId);
        if (ownerDocument.visibilityState === 'hidden') {
          pending.add(toastId);
          queueMicrotask(flushPending);
        }
      }
    }
  }

  /** Pause toasts after Zag finishes publishing a newly created item. */
  function flushPending(): void {
    const ids = [...pending];
    pending.clear();
    if (!active || ownerDocument.visibilityState !== 'hidden') return;
    for (const id of ids) {
      pauseForVisibility(id);
    }
  }

  /** Track other pause sources and items published while the page is hidden. */
  function onStoreChange(value: unknown): void {
    if (!active || publishing || !isStoreChange(value)) return;
    if (value.dismiss) {
      visibilityOwned.delete(value.id);
      externalPaused.delete(value.id);
      pending.delete(value.id);
      return;
    }
    if (ownerDocument.visibilityState !== 'hidden') return;
    // A paused item was paused by another source; anything else published while
    // the page is hidden (a new, updated, or resumed toast) pauses for it.
    if (value.paused) return;
    pending.add(value.id);
    queueMicrotask(flushPending);
  }

  /** Resume only the toasts paused for this document's visibility. */
  function syncVisibility(): void {
    if (ownerDocument.visibilityState === 'hidden') {
      for (const item of store.getVisibleToasts()) {
        if (typeof item.id === 'string' && !isPausedItem(item)) {
          pauseForVisibility(item.id);
        }
      }
      return;
    }
    for (const id of visibilityOwned) {
      if (store.isVisible(id)) sendOwnMessage(id, 'resume');
    }
    visibilityOwned.clear();
  }

  for (const item of store.getVisibleToasts()) {
    if (typeof item.id === 'string' && isPausedItem(item)) {
      externalPaused.add(item.id);
    }
  }
  const stopObserving = observeToastPauseCalls(store, onPauseCall);
  const unsubscribe = store.subscribe(onStoreChange);
  ownerDocument.addEventListener('visibilitychange', syncVisibility);
  if (ownerDocument.visibilityState === 'hidden') syncVisibility();

  /** Release the listener and any pauses owned by this Toaster. */
  function stopTracking(): void {
    active = false;
    ownerDocument.removeEventListener('visibilitychange', syncVisibility);
    unsubscribe();
    stopObserving();
    for (const id of visibilityOwned) {
      if (store.isVisible(id)) sendOwnMessage(id, 'resume');
    }
    visibilityOwned.clear();
  }

  return stopTracking;
}
