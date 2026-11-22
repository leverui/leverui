import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderMarkHydrationTree,
  type MarkHydrationComponents,
} from '../../.storybook/mark-hydration-tree';

const serverEntry = '../../dist/server/index.js';
/** The published server entry must expose the source-typed Mark components. */
const server = (await import(serverEntry)) as MarkHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate existing server marks through the published browser entry. */
async function hydrateMarkInBrowser(): Promise<void> {
  const modulePath = '/.storybook/mark-hydration-example.ts';
  const { hydrateMarkExample } = await import(modulePath);
  const root = document.getElementById('mark-hydration-root');
  if (!root) throw new Error('Mark hydration root was not found.');
  hydrateMarkExample(root);
}

/** Verify responsive variants, CSS overrides, and node identity across hydration. */
async function verifiesMarkHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same Mark tree later attached in the browser. */
    () => renderMarkHydrationTree(server),
  );
  expect(markup.match(/<mark\b/g)).toHaveLength(2);
  expect(markup).toContain('leverui-mark');
  expect(markup).not.toMatch(/<mark[^>]*\svariant=/);
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.leverui-mark{outline:2px solid rgb(1, 2, 3)}</style><div id="mark-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#mark-hydration-root');
  const mark = page.locator('#hydrated-mark');
  const responsive = page.locator('#hydrated-responsive-mark');
  await expect(mark).toHaveAttribute('data-variant', 'solid');
  await expect(mark).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(mark).toHaveCSS('outline-color', 'rgb(1, 2, 3)');
  await expect(responsive).not.toHaveCSS(
    'background-color',
    await mark.evaluate(
      /** Read the initial solid background for the responsive comparison. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
  );
  await mark.evaluate(
    /** Tag the server element to detect replacement during hydration. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture browser errors during hydration and the provider update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateMarkInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(mark).toHaveAttribute('data-server-node', 'true');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(responsive).toHaveCSS(
    'background-color',
    await mark.evaluate(
      /** Read the active solid background after the viewport changes. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
  );
  await page.locator('#mark-hydration-toggle').click();
  await expect(mark).toHaveAttribute('data-variant', 'text');
  await expect(mark).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(mark).toHaveCSS('font-weight', '500');
  await expect(mark).toHaveAttribute('data-server-node', 'true');
  await expect(mark).toHaveCSS('outline-color', 'rgb(1, 2, 3)');
  expect(errors).toEqual([]);
}

test('published Mark hydrates responsive and provider styles', verifiesMarkHydration);
