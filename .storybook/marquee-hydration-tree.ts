import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  MarqueeContent as ContentExport,
  MarqueeItem as ItemExport,
  MarqueeRoot as RootExport,
  MarqueeViewport as ViewportExport,
} from '../src';

export interface MarqueeHydrationComponents {
  MarqueeRoot: typeof RootExport;
  MarqueeViewport: typeof ViewportExport;
  MarqueeContent: typeof ContentExport;
  MarqueeItem: typeof ItemExport;
}

/** Build the same labeled Marquee for server and browser hydration. */
export function renderMarqueeHydrationTree({
  MarqueeRoot,
  MarqueeViewport,
  MarqueeContent,
  MarqueeItem,
}: MarqueeHydrationComponents): JSX.Element {
  return createComponent(MarqueeRoot, {
    id: 'hydrated-marquee',
    pauseOnInteraction: true,
    translations: { root: 'Hydrated news ticker' },
    /** Preserve the same animated tree on both sides. */
    get children() {
      return createComponent(MarqueeViewport, {
        /** Keep the content copy beneath the measured viewport. */
        get children() {
          return createComponent(MarqueeContent, {
            /** Render an item that hydration must retain. */
            get children() {
              return createComponent(MarqueeItem, {
                id: 'hydrated-marquee-item',
                children: 'Breaking news',
              });
            },
          });
        },
      });
    },
  });
}
