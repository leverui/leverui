import type { CreateToasterReturn } from './toast-store';

export type ToastPauseAction = 'pause' | 'resume';
export type ToastPauseListener = (action: ToastPauseAction, id?: string) => void;

const listeners = new WeakMap<object, Set<ToastPauseListener>>();

/** Observe real store commands instead of inherited Zag payload messages. */
export function instrumentToastPauseCalls<T>(
  store: CreateToasterReturn<T>,
): CreateToasterReturn<T> {
  if (listeners.has(store)) return store;
  const subscribers = new Set<ToastPauseListener>();
  listeners.set(store, subscribers);
  const originalPause = store.pause;
  const originalResume = store.resume;

  /** Notify current listeners after Zag applies a pause command. */
  function pause(id?: string): void {
    originalPause.call(store, id);
    for (const listener of subscribers) listener('pause', id);
  }

  /** Notify current listeners after Zag applies a resume command. */
  function resume(id?: string): void {
    originalResume.call(store, id);
    for (const listener of subscribers) listener('resume', id);
  }

  store.pause = pause;
  store.resume = resume;
  return store;
}

/** Subscribe to pause and resume calls made through the public toast store. */
export function observeToastPauseCalls<T>(
  store: CreateToasterReturn<T>,
  listener: ToastPauseListener,
): () => void {
  instrumentToastPauseCalls(store);
  const subscribers = listeners.get(store);
  if (!subscribers) throw new Error('Toast pause observation was not initialized.');
  const activeSubscribers: Set<ToastPauseListener> = subscribers;
  activeSubscribers.add(listener);

  /** Stop observing commands when the owning Toaster unmounts or moves. */
  function stopObserving(): void {
    activeSubscribers.delete(listener);
  }

  return stopObserving;
}
