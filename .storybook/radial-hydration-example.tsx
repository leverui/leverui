import { createSignal } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { RadialBarChart, RadialChart } from '../dist/index.js';
import { renderRadialHydrationTree } from './radial-hydration-tree';

/** Attach published browser charts to matching server SVG nodes. */
export function hydrateRadialExample(target: HTMLElement): void {
  const [size, setSize] = createSignal(200);
  /** Resize both charts after the client attaches. */
  function resize(): void {
    setSize(240);
  }
  hydrate(
    /** Keep the browser tree identical to the published server markup. */
    () => renderRadialHydrationTree({ RadialChart, RadialBarChart }, size, resize),
    target,
  );
  target.dataset.hydrated = 'true';
}
