import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server element so replacement is visible after hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared Select tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/select-hydration-example.tsx';
  const { hydrateSelectExample } = await import(modulePath);
  const root = document.getElementById('select-hydration-root');
  if (!root) throw new Error('Select hydration root was not found.');
  hydrateSelectExample(root);
}

/** Preserve selected values, native controls, and portal nodes across hydration. */
async function verifiesSelectHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/select-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="select-hydration-root">${markup}</div>`,
  );
  const primary = page.getByRole('combobox', { name: 'Hydrated primary' });
  const external = page.getByRole('combobox', { name: 'Hydrated external' });
  const positioner = page.getByTestId('hydrated-select-positioner');
  await expect(primary).toContainText('Solid');
  await expect(external).toContainText('React');
  await primary.evaluate(markServerNode);
  await external.evaluate(markServerNode);
  await positioner.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture published-browser errors during hydration and interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#select-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(primary).toHaveAttribute('data-server-node', 'true');
  await expect(external).toHaveAttribute('data-server-node', 'true');
  await expect(positioner).toHaveAttribute('data-server-node', 'true');
  expect(
    await page.getByTestId('hydrated-select-form').evaluate(
      /** Read both native values after published-package hydration. */
      (form) => Object.fromEntries(new FormData(form as HTMLFormElement)),
    ),
  ).toEqual({ 'primary-framework': 'solid', 'external-framework': 'react' });
  await primary.click();
  await expect(page.getByRole('listbox', { name: 'Hydrated primary' })).toBeVisible();
  await page.getByRole('option', { name: 'React' }).click();
  await expect(primary).toContainText('React');
  await external.click();
  await expect(page.getByRole('listbox', { name: 'Hydrated external' })).toBeVisible();
  await page.getByRole('option', { name: 'Solid' }).click();
  await expect(external).toContainText('Solid');
  await expect(external).toHaveAttribute('data-server-node', 'true');
  await expect(
    await page.getByTestId('hydrated-select-form').evaluate(
      /** Read both native values after interacting with each root mode. */
      (form) => Object.fromEntries(new FormData(form as HTMLFormElement)),
    ),
  ).toEqual({ 'primary-framework': 'react', 'external-framework': 'solid' });
  expect(errors).toEqual([]);
}

test('published Select hydrates both root modes and its portal', verifiesSelectHydration);
