import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  CarouselItem as ItemExport,
  CarouselItemGroup as ItemGroupExport,
  CarouselNextTrigger as NextTriggerExport,
  CarouselProgressText as ProgressTextExport,
  CarouselRoot as RootExport,
} from '../src';

export interface CarouselHydrationComponents {
  CarouselItem: typeof ItemExport;
  CarouselItemGroup: typeof ItemGroupExport;
  CarouselNextTrigger: typeof NextTriggerExport;
  CarouselProgressText: typeof ProgressTextExport;
  CarouselRoot: typeof RootExport;
}

/** Build the same two-slide Carousel for server and browser hydration. */
export function renderCarouselHydrationTree({
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselProgressText,
  CarouselRoot,
}: CarouselHydrationComponents): JSX.Element {
  return createComponent(CarouselRoot, {
    id: 'hydrated-carousel',
    count: 2,
    /** Render indexed slides and controls under one machine. */
    get children() {
      return [
        createComponent(CarouselItemGroup, {
          /** Keep the original slide nodes available after hydration. */
          get children() {
            return [
              createComponent(CarouselItem, {
                id: 'hydrated-carousel-first',
                index: 0,
                children: 'First slide',
              }),
              createComponent(CarouselItem, {
                id: 'hydrated-carousel-second',
                index: 1,
                children: 'Second slide',
              }),
            ];
          },
        }),
        createComponent(CarouselNextTrigger, {
          id: 'hydrated-carousel-next',
          children: 'Next slide',
        }),
        createComponent(CarouselProgressText, { id: 'hydrated-carousel-progress' }),
      ];
    },
  });
}
