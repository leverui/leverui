import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderTimelineHydrationTree,
  type TimelineHydrationComponents,
} from '../../.storybook/timeline-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as TimelineHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the published Timeline through its browser entry. */
async function hydrateTimelineInBrowser(): Promise<void> {
  const modulePath = '/.storybook/timeline-hydration-example.ts';
  const { hydrateTimelineExample } = await import(modulePath);
  const root = document.getElementById('timeline-hydration-root');
  if (!root) throw new Error('Timeline hydration root was not found.');
  hydrateTimelineExample(root);
}

/** Verify native nodes and reactive marker size survive hydration. */
async function verifiesTimelineHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderTimelineHydrationTree(server),
  );
  expect(markup).toContain('role="list"');
  expect(markup).toContain('role="listitem"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="timeline-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-timeline');
  const marker = page.locator('#hydrated-timeline-indicator');
  await expect(marker).toHaveCSS('width', '16px');
  await marker.evaluate(
    /** Mark the original server marker before client attachment. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser errors during attachment and update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTimelineInBrowser);
  await expect(page.locator('#timeline-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(marker).toHaveAttribute('data-server-node', 'true');
  await expect(root).toHaveAttribute('role', 'list');
  await page.locator('#timeline-hydration-toggle').click();
  await expect(marker).toHaveCSS('width', '32px');
  expect(errors).toEqual([]);
}

test('published Timeline hydrates reactive marker size on native nodes', verifiesTimelineHydration);
