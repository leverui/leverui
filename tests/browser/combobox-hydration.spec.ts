import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server node so client replacement becomes observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared tree from the published browser entry. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/combobox-hydration-example.tsx';
  const { hydrateComboboxExample } = await import(modulePath);
  const root = document.getElementById('combobox-hydration-root');
  if (!root) throw new Error('Combobox hydration root was not found.');
  hydrateComboboxExample(root);
}

/** Keep published inputs and their form values through client hydration. */
async function verifiesComboboxHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/combobox-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="combobox-hydration-root">${markup}</div>`,
  );
  const primary = page.getByRole('combobox', { name: 'Hydrated primary' });
  const external = page.getByRole('combobox', { name: 'Hydrated external' });
  const inputs = [primary, external];
  const serverOption = page.getByTestId('Hydrated primary-react');
  const ids: string[] = [];
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    if (!id) throw new Error('Published Combobox input has no ID.');
    ids.push(id);
    await input.evaluate(markServerNode);
  }
  await serverOption.evaluate(markServerNode);
  await expect(primary).toHaveValue('Solid');
  await expect(external).toHaveValue('React');
  const errors: string[] = [];
  /** Record browser failures while attaching the client machines. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#combobox-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  for (const [index, input] of inputs.entries()) {
    await expect(input).toHaveAttribute('data-server-node', 'true');
    await expect(input).toHaveAttribute('id', ids[index] ?? '');
  }
  await expect(serverOption).toHaveAttribute('data-server-node', 'true');
  await primary.fill('React');
  await expect(page.getByRole('option', { name: 'React' }).first()).toBeVisible();
  await primary.press('ArrowDown');
  await primary.press('ArrowDown');
  await expect(serverOption).toHaveAttribute('data-highlighted');
  await primary.press('Enter');
  await expect(primary).toHaveValue('React');
  const values = await page.getByTestId('hydrated-combobox-form').evaluate(
    /** Read both native form entries after hydrated keyboard selection. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(values).toEqual([
    ['primary', 'React'],
    ['external', 'React'],
  ]);
}

test('published Combobox inputs and form behavior survive hydration', verifiesComboboxHydration);
