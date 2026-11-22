import { flush } from 'solid-js';

/**
 * Let mounted Zag machines start. Zag's Solid 2 adapter starts a machine in a
 * microtask after Solid settles, so effects such as measuring or listening run
 * after this resolves.
 */
export async function settle(): Promise<void> {
  flush();
  await Promise.resolve();
  await Promise.resolve();
  flush();
}
