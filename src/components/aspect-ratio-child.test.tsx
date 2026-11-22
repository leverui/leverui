import { children, createRoot, flush } from 'solid-js';
import { expect, test } from 'vitest';
import { requireSingleChild } from './aspect-ratio-child';

/** Accept one native child and reject a second ordinary element. */
function verifiesSingleChild(): void {
  const image = document.createElement('img');
  const extra = document.createElement('style');
  flush();
  createRoot(
    /** Resolve the same child list under a Solid owner. */
    (dispose) => {
      const single = children(
        /** Resolve the one allowed native child. */
        () => image,
      );
      expect(requireSingleChild(single)).toBe(image);
      const pair = children(
        /** Resolve an ordinary second element that must be rejected. */
        () => [image, extra],
      );
      expect(
        /** Reject two elements regardless of either tag name. */
        () => requireSingleChild(pair),
      ).toThrow(/exactly one element child/);
      dispose();
    },
  );
}

test('AspectRatio requires one native element child', verifiesSingleChild);
