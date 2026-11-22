import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server radio item so client replacement becomes observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the server tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/radio-group-hydration-example.tsx';
  const { hydrateRadioGroupExample } = await import(modulePath);
  const root = document.getElementById('radio-group-hydration-root');
  if (!root) throw new Error('Radio Group hydration root was not found.');
  hydrateRadioGroupExample(root);
}

/** Preserve both root modes' selected inputs and indicators through hydration. */
async function verifiesRadioGroupHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/radio-group-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="radio-group-hydration-root">${markup}</div>`,
  );
  const primary = page.getByRole('radiogroup', { name: 'Hydrated primary' });
  const external = page.getByRole('radiogroup', { name: 'Hydrated external' });
  const primarySolid = primary.getByRole('radio', { name: 'Solid' });
  const externalReact = external.getByRole('radio', { name: 'React' });
  const primaryIndicator = page.getByTestId('Hydrated primary-solid-indicator');
  await expect(primarySolid).toBeChecked();
  await expect(externalReact).toBeChecked();
  await expect(primaryIndicator.locator('.dot')).toHaveCount(1);
  await expect(primaryIndicator).toHaveAttribute('aria-hidden', 'true');
  // Zag 2 gives roots no `id`; the scoped part attribute keeps the server ID.
  const originalIds = [
    await primary.getAttribute('data-radio-group-root'),
    await external.getAttribute('data-radio-group-root'),
  ];
  await page.getByTestId('Hydrated primary-solid').evaluate(markServerNode);
  await page.getByTestId('Hydrated external-react').evaluate(markServerNode);
  await primaryIndicator.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record client failures while the published browser package attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#radio-group-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(page.getByTestId('Hydrated primary-solid')).toHaveAttribute(
    'data-server-node',
    'true',
  );
  await expect(page.getByTestId('Hydrated external-react')).toHaveAttribute(
    'data-server-node',
    'true',
  );
  await expect(primaryIndicator).toHaveAttribute('data-server-node', 'true');
  await expect(primary).toHaveAttribute('data-radio-group-root', originalIds[0] ?? '');
  await expect(external).toHaveAttribute('data-radio-group-root', originalIds[1] ?? '');
  await primary.getByText('React', { exact: true }).click();
  await expect(primary.getByRole('radio', { name: 'React' })).toBeChecked();
  await expect(primaryIndicator.locator('.dot')).toHaveCount(0);
  await primary.getByText('Solid', { exact: true }).click();
  await expect(primaryIndicator.locator('.dot')).toHaveCount(1);
  await external.getByText('Solid', { exact: true }).click();
  await expect(external.getByRole('radio', { name: 'Solid' })).toBeChecked();
}

test('published Radio Group selection survives hydration', verifiesRadioGroupHydration);
