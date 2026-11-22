import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Button as ButtonExport, ButtonGroup as ButtonGroupExport } from '../../src';
import { renderButtonHydrationTree } from '../../.storybook/button-hydration-tree';

type ServerExports = {
  Button: typeof ButtonExport;
  ButtonGroup: typeof ButtonGroupExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button, ButtonGroup } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Button tree to its server-rendered counterpart. */
async function hydrateButtonInBrowser(stacking: 'first-on-top' | 'last-on-top'): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateButtonExample } = await import(modulePath);
  const root = document.getElementById('button-hydration-root');
  if (!root) throw new Error('Button hydration root was not found.');
  hydrateButtonExample(root, stacking);
}

/** Verify group stacking, node identity, and reactive updates through hydration. */
async function verifyButtonHydration(
  page: Page,
  stacking: 'first-on-top' | 'last-on-top',
): Promise<void> {
  const markup = renderToString(
    /** Render the published Button group with its shared hydration tree. */
    () => renderButtonHydrationTree({ Button, ButtonGroup }, stacking),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="button-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#button-hydration-root');
  const first = page.locator('#hydrated-first');
  const last = page.locator('#hydrated-last');
  await expect(first).toHaveCSS('height', '44px');
  await expect(first).toHaveAttribute('data-variant', 'surface');
  await expect(first).toHaveAttribute('data-variant-md', 'solid');
  await expect(first).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  const firstIndex = stacking === 'first-on-top' ? '3' : '0';
  const lastIndex = stacking === 'first-on-top' ? '1' : '2';
  const serverFirst = Number(await first.evaluate((element) => getComputedStyle(element).zIndex));
  const serverLast = Number(await last.evaluate((element) => getComputedStyle(element).zIndex));
  expect(serverFirst > serverLast).toBe(stacking === 'first-on-top');
  await first.evaluate(
    /** Mark the server element to detect replacement during hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Record errors raised while Solid hydrates the Button group. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateButtonInBrowser, stacking);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(first).toHaveAttribute('data-server-element', 'true');
  expect(errors).toEqual([]);
  await expect(first).toHaveCSS('z-index', firstIndex);
  await expect(last).toHaveCSS('z-index', lastIndex);
  await page.locator('#hydrated-button-toggle').click();
  await expect(page.locator('#hydrated-button-toggle')).toHaveAttribute('data-compact', 'true');
  await expect(page.locator('#hydrated-middle')).toHaveAttribute('data-leverui-group-skip', '');
  await expect(first).toHaveCSS('height', '36px');
  await expect(first).toHaveAttribute('data-variant', 'outline');
  await expect(first).toHaveAttribute('data-variant-md', 'ghost');
  await expect(first).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(first).toHaveCSS('z-index', stacking === 'first-on-top' ? '2' : '0');
  await expect(last).toHaveCSS('z-index', '1');
}

/** Exercise the first-on-top stacking order across hydration. */
async function verifiesFirstOnTopHydration({ page }: { page: Page }): Promise<void> {
  await verifyButtonHydration(page, 'first-on-top');
}

/** Exercise the last-on-top stacking order across hydration. */
async function verifiesLastOnTopHydration({ page }: { page: Page }): Promise<void> {
  await verifyButtonHydration(page, 'last-on-top');
}

test(
  'Button first-on-top group preserves stack levels through hydration',
  verifiesFirstOnTopHydration,
);
test(
  'Button last-on-top group preserves stack levels through hydration',
  verifiesLastOnTopHydration,
);
