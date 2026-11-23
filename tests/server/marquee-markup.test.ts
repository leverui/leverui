import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import {
  renderMarqueeHydrationTree,
  type MarqueeHydrationComponents,
} from '../../.storybook/marquee-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as MarqueeHydrationComponents;

/** Render the published Marquee server entry with semantic parts. */
function renderServerMarquee(): string {
  return renderToString(
    /** Keep the same machine tree used by the browser hydration check. */
    () => renderMarqueeHydrationTree(server),
  );
}

/** Check semantic attributes, duplicate accessibility, and stable CSS hooks. */
function verifiesServerMarkup(): void {
  const markup = renderServerMarquee();
  // Zag 2 identifies the root by its scoped part attribute instead of an id.
  expect(markup).toMatch(/data-marquee-root="hydrated-marquee"[^>]*role="region"/);
  expect(markup).toContain('aria-roledescription="marquee"');
  expect(markup).toContain('aria-live="off"');
  expect(markup).toContain('Hydrated news ticker');
  expect(markup).toContain('lui-marquee__root');
  expect(markup).toContain('lui-marquee__viewport');
  expect(markup).toContain('lui-marquee__content');
  expect(markup).toContain('Breaking news');
  expect(markup).toContain('aria-hidden="true"');
}

test('published Marquee renders semantic server markup', verifiesServerMarkup);
