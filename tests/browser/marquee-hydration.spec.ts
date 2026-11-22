import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderMarqueeHydrationTree,
  type MarqueeHydrationComponents,
} from '../../.storybook/marquee-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as MarqueeHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to a server-rendered Marquee. */
async function hydrateMarqueeInBrowser(): Promise<void> {
  const modulePath = '/.storybook/marquee-hydration-example.tsx';
  const { hydrateMarqueeExample } = await import(modulePath);
  const root = document.getElementById('marquee-hydration-root');
  if (!root) throw new Error('Marquee hydration root was not found.');
  hydrateMarqueeExample(root);
}

/** Verify server item nodes survive hydration and pointer pause. */
async function verifiesMarqueeHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderMarqueeHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="marquee-hydration-root">${markup}</div>`,
  );
  const root = page.locator('[data-marquee-root]');
  const item = page.locator('#hydrated-marquee-item').first();
  await expect(root).toHaveAttribute('aria-label', 'Hydrated news ticker');
  await item.evaluate(
    /** Mark the original server item before the browser attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser exceptions from hydration and pointer interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateMarqueeInBrowser);
  await expect(page.locator('#marquee-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(item).toHaveAttribute('data-server-node', 'true');
  await root.hover();
  await expect(root).toHaveAttribute('data-paused', '');
  await expect(item).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Marquee hydrates stable items and pointer pause', verifiesMarqueeHydration);
