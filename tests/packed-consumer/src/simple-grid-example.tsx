import { SimpleGrid } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed SimpleGrid count and token-width tracks. */
export function PackedSimpleGrid(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Update installed grid tracks through Solid state. */
  function toggleTracks(): void {
    setWide(!wide());
  }

  return (
    <section>
      <SimpleGrid id="packed-simple-grid" columns={wide() ? 3 : 2} style={{ width: '240px' }}>
        <span id="packed-simple-grid-child">First</span>
        <span>Second</span>
        <span>Third</span>
      </SimpleGrid>
      <SimpleGrid id="packed-simple-grid-auto" minChildWidth="24" style={{ width: '300px' }}>
        <span>Auto one</span>
        <span>Auto two</span>
        <span>Auto three</span>
      </SimpleGrid>
      <button id="packed-simple-grid-toggle" type="button" onClick={toggleTracks}>
        Change tracks
      </button>
    </section>
  );
}
