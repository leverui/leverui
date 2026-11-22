import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const markup = await readFile(
  new URL('../../.tmp/listbox-explorer-hydration.html', import.meta.url),
  'utf8',
);

/** Mark a server option so node replacement is observable. */
function markServerOption(element: Element): void {
  element.setAttribute('data-server-option', 'true');
}

/** Attach the published browser package to the Explorer's server tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-explorer-hydration-example.tsx';
  const { hydrateListboxExplorer } = await import(modulePath);
  const root = document.getElementById('listbox-explorer-hydration-root');
  if (!root) throw new Error('Explorer hydration root is missing.');
  hydrateListboxExplorer(root);
}

/** Verify grouped filtering and selection survive published hydration. */
async function verifiesExplorerHydration({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-explorer-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#listbox-explorer-hydration-root');
  const listbox = page.getByRole('listbox', { name: 'Select item' });
  const options = listbox.getByRole('option');
  const input = page.getByPlaceholder('Type to filter...');
  await expect(options).toHaveCount(9);
  await expect(listbox.getByRole('group')).toHaveCount(3);
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await options.first().evaluate(markServerOption);
  await options.last().evaluate(markServerOption);
  const id = await listbox.getAttribute('id');
  if (!id) throw new Error('Server Explorer listbox has no ID.');
  const styleCount = await page.locator('style').count();
  const errors: string[] = [];

  /** Keep browser errors from hydration and later interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(listbox).toHaveAttribute('id', id);
  await expect(options.first()).toHaveAttribute('data-server-option', 'true');
  await expect(options.last()).toHaveAttribute('data-server-option', 'true');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await input.fill('LANT');
  await expect(options).toHaveCount(1);
  await expect(listbox.getByRole('group', { name: 'Books' })).toBeVisible();
  await listbox.focus();
  await listbox.press('Home');
  await listbox.press('Enter');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await input.fill('no matching item');
  await expect(options).toHaveCount(0);
  // The primitive keeps the empty message in a status region beside the listbox.
  await expect(
    listbox.locator('xpath=..').getByRole('status').getByText('No results found'),
  ).toBeVisible();
  expect(errors).toEqual([]);
}

test('published Listbox Explorer hydrates grouped filtering', verifiesExplorerHydration);
