import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { LocaleProvider, Marquee, Stack } from '../../src';
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

/** Stack the same logos moving in opposite directions. */
export function MarqueeMultiple(): JSX.Element {
  return (
    <Stack gap="8" class="example-marquee-stack">
      <Marquee.Root autoFill>
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
    </Stack>
  );
}

/** Tilt the repeating conference banner by two degrees. */
export function MarqueeDiagonal(): JSX.Element {
  return (
    <Marquee.Root class="example-marquee-banner">
      <Marquee.Viewport>
        <Marquee.Content>
          <For each={Array.from({ length: 10 })}>
            {
              /** Give each conference phrase a separate scrolling cell. */
              () => (
                <Marquee.Item class="example-marquee-item-end">
                  <span class="example-marquee-phrase">
                    Lever UI Conf 2026
                    <span class="example-marquee-dot" />
                  </span>
                </Marquee.Item>
              )
            }
          </For>
        </Marquee.Content>
      </Marquee.Viewport>
    </Marquee.Root>
  );
}

const news = [
  'City council approves new bike lanes',
  'Library extends its weekend hours',
  'Harbor bridge reopens after repairs',
  'Farmers market returns this Saturday',
  'Storm warning issued for the coast',
] as const;

/** Show the uppercase news ticker with a fixed lead label. */
export function MarqueeNewsTicker(): JSX.Element {
  return (
    <div class="example-marquee-ticker">
      <div class="example-marquee-ticker-label">LATEST NEWS</div>
      <Marquee.Root style={{ '--leverui-marquee-duration': '40s' }}>
        <Marquee.Viewport>
          <Marquee.Content class="example-marquee-ticker-content">
            <For each={news}>
              {
                /** Separate each news headline with a dot. */
                (item) => (
                  <Marquee.Item class="example-marquee-item-end">
                    <span class="example-marquee-phrase">
                      {item}
                      <span class="example-marquee-dot" />
                    </span>
                  </Marquee.Item>
                )
              }
            </For>
          </Marquee.Content>
        </Marquee.Viewport>
      </Marquee.Root>
    </div>
  );
}

const arabicItems = [
  'مرحبا بكم',
  'تصميم جميل',
  'سهل الاستخدام',
  'مكونات قابلة للوصول',
  'أداء عالي',
  'تجربة مستخدم رائعة',
] as const;

/** Run the phrases under an Arabic locale and right-to-left text direction. */
export function MarqueeRtl(): JSX.Element {
  return (
    <LocaleProvider locale="ar-AE">
      <Marquee.Root>
        <Marquee.Viewport>
          <Marquee.Content>
            <For each={arabicItems}>
              {
                /** Keep Arabic text and its separator together. */
                (item) => (
                  <Marquee.Item class="example-marquee-rtl-item">
                    <span class="example-marquee-phrase">
                      {item}
                      <span class="example-marquee-dot" />
                    </span>
                  </Marquee.Item>
                )
              }
            </For>
          </Marquee.Content>
        </Marquee.Viewport>
      </Marquee.Root>
    </LocaleProvider>
  );
}
