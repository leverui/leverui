import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderBarSegmentHydrationTree,
  type BarSegmentHydrationComponents,
} from '../../.storybook/bar-segment-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as BarSegmentHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server segment before hydration to detect replacement. */
function markServerSegment(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the chart through the published browser entry. */
async function hydrateBarSegmentInBrowser(): Promise<void> {
  const modulePath = '/.storybook/bar-segment-hydration-example.tsx';
  const { hydrateBarSegmentExample } = await import(modulePath);
  const target = document.getElementById('bar-segment-hydration-root');
  if (!target) throw new Error('Bar Segment hydration root was not found.');
  hydrateBarSegmentExample(target);
}

/** Keep server nodes and authored styles while restoring tooltip behavior. */
async function verifiesBarSegmentHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderBarSegmentHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="bar-segment-hydration-root">${markup}</div>`,
  );
  const first = page.locator('.leverui-bar-segment__segment').first();
  await first.evaluate(markServerSegment);
  await expect(first).toHaveCSS('height', '40px');
  const errors: string[] = [];

  /** Record any client error while focus changes the chart highlight. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateBarSegmentInBrowser);
  await expect(page.locator('#bar-segment-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await first.focus();
  await expect(page.getByRole('tooltip')).toContainText('Direct');
  expect(errors).toEqual([]);
}

test('published Bar Segment hydrates without presentation styles', verifiesBarSegmentHydration);
