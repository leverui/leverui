import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderCarouselHydrationTree,
  type CarouselHydrationComponents,
} from '../../.storybook/carousel-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CarouselHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to a server-rendered Carousel. */
async function hydrateCarouselInBrowser(): Promise<void> {
  const modulePath = '/.storybook/carousel-hydration-example.tsx';
  const { hydrateCarouselExample } = await import(modulePath);
  const root = document.getElementById('carousel-hydration-root');
  if (!root) throw new Error('Carousel hydration root was not found.');
  hydrateCarouselExample(root);
}

/** Verify original slide nodes survive hydration and machine navigation. */
async function verifiesCarouselHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderCarouselHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="carousel-hydration-root">${markup}</div>`,
  );
  const root = page.locator('[data-carousel-root]');
  const first = page.locator('#hydrated-carousel-first');
  const progress = page.locator('#hydrated-carousel-progress');
  await expect(root).toHaveAttribute('aria-roledescription', 'carousel');
  await expect(progress).toHaveText('1 / 2');
  await first.evaluate(
    /** Mark the server slide so hydration can prove node continuity. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser exceptions from hydration and the machine update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateCarouselInBrowser);
  await expect(page.locator('#carousel-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-carousel-next').click();
  await expect(progress).toHaveText('2 / 2');
  await expect(first).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Carousel hydrates slide nodes and navigation', verifiesCarouselHydration);
