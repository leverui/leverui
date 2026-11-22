import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const rendererPath = fileURLToPath(
  new URL('../../scripts/render-breadcrumb-hydration.mjs', import.meta.url),
);

/** Render Breadcrumb JSX through the published server entry. */
function renderServerMarkup(): string {
  return execFileSync(process.execPath, [rendererPath], { encoding: 'utf8' });
}

/** Attach the published browser entry to server-rendered Breadcrumb markup. */
async function hydrateBreadcrumbInBrowser(): Promise<void> {
  const modulePath = '/.storybook/breadcrumb-hydration-example.tsx';
  const { hydrateBreadcrumbExample } = await import(modulePath);
  const root = document.getElementById('breadcrumb-hydration-root');
  if (!root) throw new Error('Breadcrumb hydration root was not found.');
  hydrateBreadcrumbExample(root);
}

/** Retain semantic nodes, styles, and reactive changes across hydration. */
async function verifiesBreadcrumbHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderServerMarkup();
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="breadcrumb-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-breadcrumb');
  const list = page.locator('#hydrated-breadcrumb-list');
  const current = page.locator('#hydrated-breadcrumb-current');
  await expect(root).toHaveJSProperty('tagName', 'NAV');
  await expect(list).toHaveCSS('font-size', '12px');
  await expect(current).toHaveText('Settings');
  await root.evaluate(
    /** Mark the server navigation landmark before browser hydration. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await current.evaluate(
    /** Mark the original current-location node for continuity checks. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record browser exceptions during hydration and reactive updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateBreadcrumbInBrowser);
  await expect(page.locator('#breadcrumb-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(current).toHaveAttribute('data-server-node', 'true');
  await page.locator('#breadcrumb-hydration-toggle').click();
  await expect(list).toHaveCSS('font-size', '16px');
  await expect(current).toHaveText('Account');
  await expect(current).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Breadcrumb hydrates semantic nodes and reactive styles',
  verifiesBreadcrumbHydration,
);
