import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Marquee, Stack } from '../../src';
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

const speeds = [
  { value: 25, label: 'Slow (25px/s)' },
  { value: 50, label: 'Normal (50px/s)' },
  { value: 100, label: 'Fast (100px/s)' },
] as const;

/** Compare the three named animation speeds. */
export function MarqueeWithSpeed(): JSX.Element {
  return (
    <Stack gap="12">
      <For each={speeds}>
        {
          /** Keep one labeled marquee per speed. */
          (speed) => (
            <Stack gap="4">
              <span class="example-marquee-speed-label">{speed.label}</span>
              <Marquee.Root speed={speed.value}>
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
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

/** Pause motion when the visitor hovers or focuses the marquee. */
export function MarqueePauseOnInteraction(): JSX.Element {
  return (
    <Marquee.Root pauseOnInteraction>
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
  );
}

/** Fade both ends of the logo animation. */
export function MarqueeEdges(): JSX.Element {
  return (
    <Marquee.Root>
      <Marquee.Edge side="start" />
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
      <Marquee.Edge side="end" />
    </Marquee.Root>
  );
}
