import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { InputGroupHydrationComponents } from '../../.storybook/input-group-hydration-tree';
import { renderInputGroupHydrationTree } from '../../.storybook/input-group-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as InputGroupHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser group tree to the published server field. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/input-group-hydration-example.tsx';
  const { hydrateInputGroupExample } = await import(modulePath);
  const root = document.getElementById('input-group-hydration-root');
  if (!root) throw new Error('Input Group hydration root was not found.');
  hydrateInputGroupExample(root);
}

/** Preserve the native field and style lifetime through hydration and updates. */
async function verifiesInputGroupHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same component tree with the published server bundle. */
    () => renderInputGroupHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready&viewMode=story');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="input-group-hydration-root">${markup}</div>`,
  );
  const input = page.locator('#hydrated-input-group-field');
  await expect(input).toHaveValue('draft');
  const originalClass = await input.getAttribute('class');
  const initialPadding = await input.evaluate(
    /** Measure the server field's CSS-derived adornment spacing. */
    (node) => getComputedStyle(node).paddingInlineStart,
  );
  await input.evaluate(
    /** Mark the server field so replacement is observable. */
    (node) => {
      (node as HTMLElement).dataset.serverField = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect browser errors from hydration and its reactive update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#input-group-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(input).toHaveAttribute('data-server-field', 'true');
  await expect(input).toHaveAttribute('class', originalClass ?? '');
  await page.locator('#hydrated-input-group-toggle').click();
  await expect(input).toHaveAttribute('data-server-field', 'true');
  await expect(input).toHaveAttribute('class', originalClass ?? '');
  const updatedPadding = await input.evaluate(
    /** Measure the hydrated field after its native CSS variable changes. */
    (node) => getComputedStyle(node).paddingInlineStart,
  );
  expect(updatedPadding).not.toBe(initialPadding);
  await expect(input).toHaveValue('draft');
  expect(errors).toEqual([]);
}

test('published Input Group hydrates without replacing its field', verifiesInputGroupHydration);
