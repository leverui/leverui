import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Marquee } from '../../src';
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

/** Repeat the logos until they fill the viewport. */
export function MarqueeAutoFill(): JSX.Element {
  return (
    <Marquee.Root autoFill spacing="2rem">
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

/** Move the full logo track in the reverse direction. */
export function MarqueeReverseDirection(): JSX.Element {
  return (
    <Marquee.Root reverse autoFill>
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

/** Animate the logo track vertically from bottom to top. */
export function MarqueeVertical(): JSX.Element {
  return (
    <Marquee.Root side="bottom" style={{ height: '300px' }} spacing="2rem">
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
