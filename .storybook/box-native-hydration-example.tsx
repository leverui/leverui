import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { Box } from '../src';

/** Attach a provider-free Box to its existing server element. */
export function hydrateNativeBox(target: HTMLElement): void {
  /** Mark the host after Solid has reused the server markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same native Box tree used on the server. */
  function renderTree() {
    const tree = (
      <Box as="section" id="native-hydrated-box" class="consumer-native-box">
        Native Box
      </Box>
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderTree, target);
}
