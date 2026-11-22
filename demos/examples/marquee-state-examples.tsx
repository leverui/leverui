import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PauseIcon, PlayIcon } from '@lucide/solid';
import { Button, Marquee, Stack, useMarquee } from '../../src';
import './marquee-examples.css';
import {
  FernwayLogo,
  HalcyonLogo,
  LumenLogo,
  NorthwindLogo,
  OrbitLogo,
  QuartzLogo,
} from './brand-logos';

const brands = [
  { name: 'Northwind', icon: NorthwindLogo, color: '#2563eb' },
  { name: 'Halcyon', icon: HalcyonLogo, color: '#0d9488' },
  { name: 'Quartz', icon: QuartzLogo, color: '#7c3aed' },
  { name: 'Lumen', icon: LumenLogo, color: '#d97706' },
  { name: 'Orbit', icon: OrbitLogo, color: '#e11d48' },
  { name: 'Fernway', icon: FernwayLogo, color: '#16a34a' },
] as const;

/** Control the marquee machine with the Pause and Resume buttons. */
export function MarqueeStore(): JSX.Element {
  const marquee = useMarquee();

  return (
    <Stack gap="8">
      <Marquee.RootProvider value={marquee}>
        <Marquee.Viewport>
          <Marquee.Content>
            <For each={brands}>
              {
                /** Keep each brand in its own marquee item for machine duplication. */
                (brand) => (
                  <Marquee.Item class="example-marquee-brand-item">
                    <brand.icon
                      class="example-marquee-brand-icon"
                      role="img"
                      aria-label={brand.name}
                      style={{ color: brand.color }}
                    />
                  </Marquee.Item>
                )
              }
            </For>
          </Marquee.Content>
        </Marquee.Viewport>
      </Marquee.RootProvider>
      <div class="example-marquee-actions">
        <Button
          size="sm"
          variant="outline"
          hidden={marquee().paused}
          onClick={
            /** Suspend the shared animation. */
            () => marquee().pause()
          }
        >
          <PauseIcon /> Pause
        </Button>
        <Button
          size="sm"
          variant="outline"
          hidden={!marquee().paused}
          onClick={
            /** Resume the shared animation. */
            () => marquee().resume()
          }
        >
          <PlayIcon /> Resume
        </Button>
      </div>
    </Stack>
  );
}

/** Count the three finite animation loops and completion. */
export function MarqueeFiniteLoops(): JSX.Element {
  const [loops, setLoops] = createSignal(0);
  const [completed, setCompleted] = createSignal(0);

  return (
    <>
      <Marquee.Root
        loopCount={3}
        onLoopComplete={
          /** Record an iteration from the marquee machine. */
          () => setLoops(loops() + 1)
        }
        onComplete={
          /** Record the final animation completion. */
          () => setCompleted(completed() + 1)
        }
      >
        <Marquee.Viewport>
          <Marquee.Content>
            <For each={brands}>
              {
                /** Keep each brand in its own marquee item for machine duplication. */
                (brand) => (
                  <Marquee.Item class="example-marquee-brand-item">
                    <brand.icon
                      class="example-marquee-brand-icon"
                      role="img"
                      aria-label={brand.name}
                      style={{ color: brand.color }}
                    />
                  </Marquee.Item>
                )
              }
            </For>
          </Marquee.Content>
        </Marquee.Viewport>
      </Marquee.Root>
      <Stack textStyle="sm" class="example-marquee-loop-stats">
        <p>Loops completed: {loops()}</p>
        <p>Animations completed: {completed()}</p>
      </Stack>
    </>
  );
}
