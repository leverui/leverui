/** Observe a media query, including browsers with legacy listener methods. */
export function listenMediaQuery(list: MediaQueryList, update: () => void): () => void {
  if (typeof list.addEventListener === 'function') {
    try {
      list.addEventListener('change', update);
      /** Remove the modern media listener. */
      return function stop(): void {
        list.removeEventListener('change', update);
      };
    } catch {
      // Some browsers expose the modern method but only support legacy listeners.
    }
  }
  list.addListener(update);
  /** Remove the legacy media listener. */
  return function stop(): void {
    list.removeListener(update);
  };
}
