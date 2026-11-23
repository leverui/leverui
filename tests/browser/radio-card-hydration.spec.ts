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
  const modulePath = '/.storybook/radio-card-hydration-example.tsx';
  const { hydrateRadioCardExample } = await import(modulePath);
  const root = document.getElementById('radio-card-hydration-root');
  if (!root) throw new Error('Radio Card hydration root was not found.');
  hydrateRadioCardExample(root);
}

/** Preserve both root modes' selected native inputs through hydration. */
async function verifiesRadioCardHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/radio-card-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="radio-card-hydration-root">${markup}</div>`,
  );
  const primary = page.getByRole('radiogroup', { name: 'Hydrated primary' });
  const external = page.getByRole('radiogroup', { name: 'Hydrated external' });
  const primarySolid = primary.getByRole('radio', { name: 'Solid' });
  const externalReact = external.getByRole('radio', { name: 'React' });
  const primaryIcon = page.getByTestId('Hydrated primary-solid-custom-indicator');
  await expect(primarySolid).toBeChecked();
  await expect(externalReact).toBeChecked();
  await expect(primaryIcon).toHaveClass(/lui-radio-card__itemIndicator/);
  await expect(primaryIcon).toHaveAttribute('aria-hidden', 'true');
  // Zag 2 gives roots no `id`; the scoped part attribute keeps the server ID.
  const originalIds = [
    await primary.getAttribute('data-radio-group-root'),
    await external.getAttribute('data-radio-group-root'),
  ];
  await page.getByTestId('Hydrated primary-solid').evaluate(markServerNode);
  await page.getByTestId('Hydrated external-react').evaluate(markServerNode);
  await primaryIcon.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record client failures while the published browser package attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#radio-card-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(page.getByTestId('Hydrated primary-solid')).toHaveAttribute(
    'data-server-node',
    'true',
  );
  await expect(page.getByTestId('Hydrated external-react')).toHaveAttribute(
    'data-server-node',
    'true',
  );
  await expect(primaryIcon).toHaveAttribute('data-server-node', 'true');
  await expect(primary).toHaveAttribute('data-radio-group-root', originalIds[0] ?? '');
  await expect(external).toHaveAttribute('data-radio-group-root', originalIds[1] ?? '');
  await primary.getByText('React', { exact: true }).click();
  await expect(primary.getByRole('radio', { name: 'React' })).toBeChecked();
  await expect(primaryIcon).toHaveCount(0);
  await primary.getByText('Solid', { exact: true }).click();
  await expect(primaryIcon).toHaveClass(/lui-radio-card__itemIndicator/);
  await external.getByText('Solid', { exact: true }).click();
  await expect(external.getByRole('radio', { name: 'Solid' })).toBeChecked();
  await expect(page.getByTestId('Hydrated external-solid-custom-indicator')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
}

test('published Radio Card selection survives hydration', verifiesRadioCardHydration);
