/** Build the rejection a cancelled request reports, matching `fetch`. */
function abortError(): DOMException {
  return new DOMException('The request was aborted.', 'AbortError');
}

/**
 * Wait like a network round trip so async demos can show loading, cancellation,
 * and failure states without contacting a third-party service. The request
 * rejects when its signal aborts and fails while the browser reports it is
 * offline, which lets visitors and tests reach the error and retry paths.
 */
export function simulateRequest(latencyMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>(
    /** Settle after the latency unless the caller cancels first. */
    (resolve, reject) => {
      if (signal?.aborted) {
        reject(abortError());
        return;
      }
      const timer = setTimeout(
        /** Finish the simulated round trip. */
        () => {
          signal?.removeEventListener('abort', cancel);
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            reject(new Error('Network unavailable'));
            return;
          }
          resolve();
        },
        latencyMs,
      );
      /** Stop the pending round trip when the caller aborts. */
      function cancel(): void {
        clearTimeout(timer);
        reject(abortError());
      }
      signal?.addEventListener('abort', cancel, { once: true });
    },
  );
}
