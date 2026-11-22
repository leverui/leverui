import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { InputAddonHydrationComponents } from '../../.storybook/input-addon-hydration-tree';
import { renderInputAddonHydrationTree } from '../../.storybook/input-addon-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as InputAddonHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the client addon tree to the existing published server element. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/input-addon-hydration-example.tsx';
  const { hydrateInputAddonExample } = await import(modulePath);
  const root = document.getElementById('input-addon-hydration-root');
  if (!root) throw new Error('Input Addon hydration root was not found.');
  hydrateInputAddonExample(root);
}

/** Preserve server node, styling, and content through hydration and updates. */
async function verifiesInputAddonHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared addon tree with the published server components. */
    () => renderInputAddonHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready&viewMode=story');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="input-addon-hydration-root">${markup}</div>`,
  );
  const addon = page.locator('#hydrated-input-addon');
  await expect(addon).toHaveText('https://');
  await expect(addon).toHaveCSS('border-top-width', '1px');
  const originalClass = await addon.getAttribute('class');
  await addon.evaluate(
    /** Mark the server element so replacement is observable. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect browser errors from hydration and reactive updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#input-addon-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(addon).toHaveAttribute('data-server-element', 'true');
  await expect(addon).toHaveAttribute('class', originalClass ?? '');
  await expect(addon).toHaveText('https://');
  await page.locator('#hydrated-input-addon-toggle').click();
  await expect(addon).toHaveAttribute('data-server-element', 'true');
  await expect(addon).toHaveAttribute('class', originalClass ?? '');
  await expect(addon).toHaveAttribute('data-size', 'lg');
  expect(errors).toEqual([]);
}

test('published Input Addon hydrates without replacing its element', verifiesInputAddonHydration);
