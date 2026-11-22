import { expect, test, vi } from 'vitest';
import { listenMediaQuery } from './media-query-listener';

/** Verify listener registration falls back when the modern method throws. */
function verifiesLegacyFallback(): void {
  const addListener = vi.fn();
  const removeListener = vi.fn();
  const list = Object.assign(new EventTarget(), {
    media: '(min-width: 900px)',
    matches: false,
    onchange: null,
    addListener,
    removeListener,
  });
  Object.defineProperty(list, 'addEventListener', {
    /** Model a browser that exposes but cannot use the modern method. */
    value: vi.fn(
      /** Reject modern listener registration for this media list. */
      () => {
        throw new Error('unsupported');
      },
    ),
  });
  const update = vi.fn();
  // The fixture implements the MediaQueryList fields used by the listener.
  const cleanup = listenMediaQuery(list as MediaQueryList, update);
  expect(addListener).toHaveBeenCalledWith(update);
  cleanup();
  expect(removeListener).toHaveBeenCalledWith(update);
}

test('media-query listener falls back to legacy registration', verifiesLegacyFallback);
