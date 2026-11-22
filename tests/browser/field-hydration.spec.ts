import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FieldHydrationComponents } from '../../.storybook/field-hydration-tree';
import { renderFieldHydrationTree } from '../../.storybook/field-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as FieldHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the client Field tree to the published server markup. */
async function hydrateFieldInBrowser(): Promise<void> {
  const modulePath = '/.storybook/field-hydration-example.tsx';
  const { hydrateFieldExample } = await import(modulePath);
  const root = document.getElementById('field-hydration-root');
  if (!root) throw new Error('Field hydration root was not found.');
  hydrateFieldExample(root);
}

/** Verify generated IDs, existing nodes, descriptions, and style reuse. */
async function verifiesFieldHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared public Field through the published server entry. */
    () => renderFieldHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="field-hydration-root">${markup}</div>`,
  );
  const input = page.getByTestId('hydrated-field-input');
  const id = await input.getAttribute('id');
  expect(id).toBeTruthy();
  await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  await input.evaluate(
    /** Mark the original input to detect accidental replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await input.fill('typed before hydration');
  const errors: string[] = [];

  /** Collect client errors during attachment and interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFieldInBrowser);
  await expect(page.locator('#field-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(input).toHaveAttribute('data-server-element', 'true');
  await expect(input).toHaveAttribute('id', id ?? '');
  await expect(input).toHaveValue('typed before hydration');
  await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await page.getByTestId('hydrated-field-validate').click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('Field error')).toBeVisible();
  expect(errors).toEqual([]);
}

test(
  'published Field hydrates without replacing controls or duplicating styles',
  verifiesFieldHydration,
);
