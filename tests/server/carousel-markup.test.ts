import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import {
  renderCarouselHydrationTree,
  type CarouselHydrationComponents,
} from '../../.storybook/carousel-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CarouselHydrationComponents;

/** Render the published Carousel server entry with indexed slides. */
function renderServerCarousel(): string {
  return renderToString(
    /** Keep the same machine tree used by the browser hydration check. */
    () => renderCarouselHydrationTree(server),
  );
}

/** Check semantic and styled hooks in the published server markup. */
function verifiesServerMarkup(): void {
  const markup = renderServerCarousel();
  // Zag 2 identifies the root by its scoped part attribute instead of an id.
  expect(markup).toMatch(/data-carousel-root="hydrated-carousel"[^>]*role="region"/);
  expect(markup).toContain('aria-roledescription="carousel"');
  expect(markup).toContain('lui-carousel__root');
  expect(markup).toContain('lui-carousel__itemGroup');
  expect(markup).toContain('First slide');
  expect(markup).toContain('Second slide');
  expect(markup).toContain('1 / 2');
}

test('published Carousel renders semantic server markup', verifiesServerMarkup);
