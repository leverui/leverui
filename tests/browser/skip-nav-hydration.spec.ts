import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderSkipNavHydrationTree,
  type SkipNavHydrationComponents,
} from '../../.storybook/skip-nav-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SkipNavHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser tree to the published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/skip-nav-hydration-example.ts';
  const { hydrateSkipNavExample } = await import(modulePath);
  const root = document.getElementById('skip-nav-hydration-root');
  if (!root) throw new Error('Skip Nav hydration root was not found.');
  hydrateSkipNavExample(root);
}

/** Preserve server nodes while restoring reactive targets and keyboard skipping. */
async function verifiesSkipNavHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the fixture through the published server entry. */
    () => renderSkipNavHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="skip-nav-hydration-root">${markup}</div>`,
  );
  const link = page.getByTestId('hydrated-skip-link');
  const content = page.getByTestId('hydrated-skip-content');
  await expect(link).toHaveAttribute('href', '#hydrated-main');
  await expect(content).toHaveAttribute('id', 'hydrated-main');
  await expect(link).toHaveCSS('position', 'absolute');
  for (const element of [link, content]) {
    await element.evaluate(
      /** Mark the server node before Solid attaches. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Collect browser errors during hydration and interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#skip-nav-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(link).toHaveAttribute('data-server-node', 'true');
  await expect(content).toHaveAttribute('data-server-node', 'true');
  await expect(link).toHaveAttribute('data-ref-called', 'true');
  await expect(content).toHaveAttribute('data-ref-called', 'true');
  await expect(link).toHaveCSS('position', 'absolute');
  await page.locator('#hydrated-skip-change').click();
  await expect(link).toHaveAttribute('href', '#updated-main');
  await expect(content).toHaveAttribute('id', 'updated-main');
  await expect(link).toHaveAttribute('data-server-node', 'true');
  await expect(content).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-skip-change').focus();
  await pressBrowserTab(page, true);
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('position', 'fixed');
  await page.keyboard.press('Enter');
  await expect(content).toBeFocused();
  expect(errors).toEqual([]);
}

test('published Skip Nav hydrates without replacing its nodes', verifiesSkipNavHydration);
