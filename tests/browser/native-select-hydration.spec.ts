import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { NativeSelectHydrationComponents } from '../../.storybook/native-select-hydration-tree';
import { renderNativeSelectHydrationTree } from '../../.storybook/native-select-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as NativeSelectHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser select tree to the published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/native-select-hydration-example.tsx';
  const { hydrateNativeSelectExample } = await import(modulePath);
  const root = document.getElementById('native-select-hydration-root');
  if (!root) throw new Error('Native Select hydration root was not found.');
  hydrateNativeSelectExample(root);
}

/** Preserve the native select and style lifetime through hydration and updates. */
async function verifiesNativeSelectHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same compound tree through the published server entry. */
    () => renderNativeSelectHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready&viewMode=story');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><form id="native-select-form"><div id="native-select-hydration-root">${markup}</div></form>`,
  );
  const select = page.locator('#hydrated-native-select-field');
  const controlled = page.locator('#hydrated-controlled-native-select');
  await expect(select).toHaveValue('ca');
  await expect(controlled).toHaveValue('us');
  const originalClass = await select.getAttribute('class');
  const root = page.locator('#hydrated-native-select');
  await select.evaluate(
    /** Mark the server element so replacement is observable. */
    (element) => {
      (element as HTMLElement).dataset.serverSelect = 'true';
    },
  );
  const errors: string[] = [];

  /** Record runtime errors from hydration and its reactive update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#native-select-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(select).toHaveAttribute('data-server-select', 'true');
  await expect(select).toHaveAttribute('class', originalClass ?? '');
  await expect(controlled).toHaveValue('us');
  await page.locator('#hydrated-native-select-toggle').click();
  await expect(select).toHaveAttribute('data-server-select', 'true');
  await expect(select).toHaveAttribute('class', originalClass ?? '');
  await expect(root).toHaveAttribute('data-size', 'lg');
  await expect(select).toHaveValue('ca');
  await page.locator('#hydrated-controlled-toggle').click();
  await expect(controlled).toHaveValue('ca');
  await select.selectOption('us');
  await expect(select).toHaveValue('us');
  await page.locator('#native-select-form').evaluate(
    /** Exercise the browser's own reset algorithm after hydration. */
    (element) => (element as HTMLFormElement).reset(),
  );
  await expect(select).toHaveValue('ca');
  expect(errors).toEqual([]);
}

test('published Native Select hydrates without replacing its field', verifiesNativeSelectHydration);
