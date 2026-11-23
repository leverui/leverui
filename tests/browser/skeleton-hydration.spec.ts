import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderSkeletonHydrationTree,
  type SkeletonHydrationComponents,
} from '../../.storybook/skeleton-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SkeletonHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published Skeleton browser bundle to server markup. */
async function hydrateSkeletonInBrowser(): Promise<void> {
  const modulePath = '/.storybook/skeleton-hydration-example.ts';
  const { hydrateSkeletonExample } = await import(modulePath);
  const host = document.getElementById('skeleton-hydration-root');
  if (!host) throw new Error('Skeleton hydration root was not found.');
  hydrateSkeletonExample(host);
}

/** Verify native nodes, line count, styles, and content survive hydration. */
async function verifiesSkeletonHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Build the server tree before attaching the browser entry. */
    () => renderSkeletonHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="skeleton-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#skeleton-hydration-root');
  const skeleton = page.locator('#hydrated-skeleton');
  const text = page.locator('#hydrated-skeleton-text');
  await expect(text.locator('.lui-skeleton')).toHaveCount(2);
  await expect(text).toHaveText('Finished textFinished text');
  await text
    .locator('.lui-skeleton')
    .first()
    .evaluate(
      /** Mark the first server-rendered text line before attachment. */
      (element) => element.setAttribute('data-first-text-line', 'true'),
    );
  await skeleton.evaluate(
    /** Mark the server element before Solid hydrates it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect uncaught browser errors during attachment. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Collect hydration warnings from the browser console. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      /error|warning/.test(message.type()) &&
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    ) {
      errors.push(message.text());
    }
  }

  page.on('pageerror', recordPageError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateSkeletonInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(skeleton).toHaveAttribute('data-server-node', 'true');
  await page.locator('#skeleton-hydration-toggle').click();
  await expect(text.locator('.lui-skeleton')).toHaveCount(1);
  await expect(text).toContainText('Finished text');
  await expect(text.locator('.lui-skeleton').first()).toHaveAttribute(
    'data-first-text-line',
    'true',
  );
  await expect(skeleton).toHaveAttribute('data-server-node', 'true');
  await expect(skeleton).toHaveCSS('animation-name', 'fade-in');
  expect(errors).toEqual([]);
}

test('published Skeleton hydrates loading content and text lines', verifiesSkeletonHydration);
