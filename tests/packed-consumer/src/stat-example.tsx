import { Stat, StatGroup, StatPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Stat types, slots, group variants, and live defaults. */
export function PackedStat(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change a provider's size without remounting the native list. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Mark the native description list delivered through a precise ref. */
  function markRoot(element: HTMLDListElement): void {
    element.dataset.packedStatRef = 'dl';
  }

  return (
    <section>
      <Stat.Root id="packed-stat" ref={markRoot}>
        <Stat.Label>Visitors</Stat.Label>
        <Stat.ValueText id="packed-stat-value">192k</Stat.ValueText>
        <Stat.HelpText>
          <Stat.UpIndicator id="packed-stat-up" />
          12%
        </Stat.HelpText>
      </Stat.Root>
      <StatGroup size="lg" id="packed-stat-group">
        <Stat.Root>
          <Stat.Label>Sales</Stat.Label>
          <Stat.ValueText id="packed-stat-group-value">$42k</Stat.ValueText>
        </Stat.Root>
      </StatGroup>
      <StatPropsProvider
        value={
          /** Read current shared size from the consumer signal. */
          () => ({ size: large() ? 'lg' : 'sm' })
        }
      >
        <Stat.Root id="packed-reactive-stat">
          <Stat.Label>Reactive</Stat.Label>
          <Stat.ValueText id="packed-reactive-stat-value">25</Stat.ValueText>
        </Stat.Root>
      </StatPropsProvider>
      <button type="button" id="packed-stat-toggle" onClick={toggleSize}>
        Toggle Stat size
      </button>
    </section>
  );
}
