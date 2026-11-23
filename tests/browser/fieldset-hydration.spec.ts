import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FieldsetHydrationComponents } from '../../.storybook/fieldset-hydration-tree';
import { renderFieldsetHydrationTree } from '../../.storybook/fieldset-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as FieldsetHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the client Fieldset tree to its published server markup. */
async function hydrateFieldsetInBrowser(): Promise<void> {
  const modulePath = '/.storybook/fieldset-hydration-example.tsx';
  const { hydrateFieldsetExample } = await import(modulePath);
  const root = document.getElementById('fieldset-hydration-root');
  if (!root) throw new Error('Fieldset hydration root was not found.');
  hydrateFieldsetExample(root);
}

/** Verify native nodes, association IDs, validation, and style reuse. */
async function verifiesFieldsetHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared public Fieldset through the published server entry. */
    () => renderFieldsetHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style data-lui-default>${defaultCss}</style><div id="fieldset-hydration-root">${markup}</div>`,
  );
  const group = page.getByTestId('hydrated-fieldset');
  const input = page.getByTestId('hydrated-fieldset-input');
  const legendId = await group.getAttribute('aria-labelledby');
  expect(legendId).toBe('fieldset::hydrated-group::legend');
  await expect(page.locator(`[id="${legendId}"]`)).toHaveText('Hydrated contact');
  await group.evaluate(
    /** Mark the server-rendered group before client attachment. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await input.evaluate(
    /** Mark the server-rendered input before client attachment. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await input.fill('typed before hydration');
  await expect(group).toHaveCSS('display', 'flex');
  await expect(page.locator('style[data-lui-default]')).toHaveCount(1);
  const errors: string[] = [];

  /** Capture hydration and interaction errors in Chromium. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFieldsetInBrowser);
  await expect(page.locator('#fieldset-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(group).toHaveAttribute('data-server-element', 'true');
  await expect(input).toHaveAttribute('data-server-element', 'true');
  await expect(input).toHaveValue('typed before hydration');
  await expect(group).toHaveAttribute('aria-labelledby', legendId ?? '');
  await expect(group).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(page.locator('[id="fieldset::hydrated-group::helper-text"]')).toHaveText(
    'Group help',
  );
  await expect(group).toHaveCSS('display', 'flex');
  await expect(page.locator('style[data-lui-default]')).toHaveCount(1);
  await page.getByTestId('hydrated-fieldset-toggle').click();
  await expect(group).toHaveAttribute('data-invalid', '');
  await expect(group).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.locator('[id="fieldset::hydrated-group::error-text"]')).toHaveText(
    'Group error',
  );
  await page.getByTestId('hydrated-fieldset-toggle').click();
  await expect(page.getByText('Group error')).toHaveCount(0);
  await expect(group).not.toHaveAttribute('aria-describedby', /error-text/);
  await expect(group).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(page.locator('style[data-lui-default]')).toHaveCount(1);
  expect(errors).toEqual([]);
}

test('published Fieldset hydrates without replacing controls or styles', verifiesFieldsetHydration);
