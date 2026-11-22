import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { AbsoluteCenterHydrationComponents } from '../../.storybook/absolute-center-hydration-tree';
import { renderAbsoluteCenterHydrationTree } from '../../.storybook/absolute-center-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as AbsoluteCenterHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the same centered tree through the browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/absolute-center-hydration-example.tsx';
  const { hydrateAbsoluteCenterExample } = await import(modulePath);
  const root = document.getElementById('absolute-center-hydration-root');
  if (!root) throw new Error('Absolute Center hydration root was not found.');
  hydrateAbsoluteCenterExample(root);
}

/** Verify server layout, node reuse, and a live axis change after hydration. */
async function verifiesAbsoluteCenterHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderAbsoluteCenterHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}#hydrated-center{padding-inline:8px}#hydrated-center[data-axis=horizontal]{padding-inline:16px}</style><div id="absolute-center-hydration-root">${markup}</div>`,
  );
  const center = page.locator('#hydrated-center');
  await expect(center).toHaveCSS('translate', '-50% -50%');
  await expect(center).toHaveCSS('padding-left', '8px');
  await center.evaluate(
    /** Tag the original server node to detect hydration replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Capture errors from client attachment and the subsequent update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#absolute-center-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(center).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-axis-toggle').click();
  await expect(center).toHaveCSS('translate', '-50%');
  await expect(center).toHaveCSS('padding-left', '16px');
  await expect(center).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published AbsoluteCenter hydrates and reacts without node replacement',
  verifiesAbsoluteCenterHydration,
);
