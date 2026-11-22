import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderCssScopeDisposalExample } from '../../.storybook/css-scope-disposal-example';
import type { Box as BoxExport } from '../../src';

type ServerParts = {
  Box: typeof BoxExport;
};

const serverEntry = '../../dist/server/index.js';
const serverParts = (await import(serverEntry)) as ServerParts;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const scopedCss = await readFile(
  new URL('../../.storybook/css-scope-disposal.css', import.meta.url),
  'utf8',
);

/** Render both removable CSS scopes through the package server entry. */
function renderServerExample(): JSX.Element {
  return renderCssScopeDisposalExample(serverParts);
}

/** Hydrate the shared fixture in Chromium. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/css-scope-disposal-hydration.ts';
  const { hydrateCssScopeDisposalExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateCssScopeDisposalExample(root);
}

/** Mark the sibling element to detect a replacement after hydration. */
function markSibling(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Keep sibling styles while each CSS scope unmounts independently. */
async function verifiesCssScopeDisposal({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerExample);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style data-testid="scope-css">${scopedCss}</style><div id="hydration-root">${markup}</div>`,
  );

  const alpha = page.locator('#alpha-disposal-box');
  const beta = page.locator('#beta-disposal-box');
  const scopeStyles = page.getByTestId('scope-css');
  await expect(alpha).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(beta).toHaveCSS('background-color', 'rgb(169, 85, 0)');
  await expect(scopeStyles).toHaveCount(1);
  await beta.evaluate(markSibling);

  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(scopeStyles).toHaveCount(1);

  await page.locator('#remove-alpha').click();
  await expect(alpha).toHaveCount(0);
  await expect(beta).toHaveAttribute('data-before-hydration', 'true');
  await expect(beta).toHaveCSS('background-color', 'rgb(169, 85, 0)');
  await expect(beta).toHaveCSS('padding', '16px');
  await expect(scopeStyles).toHaveCount(1);

  await page.locator('#remove-beta').click();
  await expect(beta).toHaveCount(0);
  await expect(scopeStyles).toHaveCount(1);
}

test(
  'removing CSS scopes preserves sibling styles and the static stylesheet',
  verifiesCssScopeDisposal,
);
