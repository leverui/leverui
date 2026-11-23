import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselProgressText,
  CarouselRoot,
} from '@leverui/components';

/** Render the installed Carousel package in a separate Solid consumer. */
function renderCarousel() {
  return createComponent(CarouselRoot, {
    count: 2,
    /** Render indexed slides and a machine-controlled next button. */
    get children() {
      return [
        createComponent(CarouselItemGroup, {
          /** Associate each slide with its machine index. */
          get children() {
            return [
              createComponent(CarouselItem, { index: 0, children: 'First' }),
              createComponent(CarouselItem, { index: 1, children: 'Second' }),
            ];
          },
        }),
        createComponent(CarouselNextTrigger, { children: 'Next' }),
        createComponent(CarouselProgressText, {}),
      ];
    },
  });
}

const markup = renderToString(renderCarousel);
assert.match(markup, /aria-roledescription="carousel"/);
assert.match(markup, /lui-carousel__itemGroup/);
assert.match(markup, /First/);
assert.match(markup, /1 \/ 2/);
