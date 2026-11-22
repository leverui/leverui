import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const markup = await readFile(
  new URL('../../.tmp/listbox-dialog-hydration.html', import.meta.url),
  'utf8',
);

/** Mark a server option so hydration cannot replace it unnoticed. */
function markServerOption(element: Element): void {
  element.setAttribute('data-server-option', 'true');
}

/** Attach the published browser package to the open Dialog tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-dialog-hydration-example.tsx';
  const { hydrateListboxDialog } = await import(modulePath);
  const root = document.getElementById('listbox-dialog-hydration-root');
  if (!root) throw new Error('Dialog Listbox hydration root is missing.');
  hydrateListboxDialog(root);
}

/** Verify Dialog portals, Listbox options, and focus across hydration. */
async function verifiesDialogHydration({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style data-listbox-default-css>${defaultCss}</style><div id="listbox-dialog-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#listbox-dialog-hydration-root');
  const trigger = page.getByTestId('dialog-listbox-trigger');
  const dialog = page.getByRole('dialog', { name: 'Search apps or commands' });
  const listbox = dialog.getByRole('listbox', { name: 'Search results' });
  const options = listbox.getByRole('option');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('kbd')).toHaveCount(3);
  await expect(options).toHaveCount(10);
  await expect(listbox.getByRole('group')).toHaveCount(2);
  await options.first().evaluate(markServerOption);
  await options.last().evaluate(markServerOption);
  const dialogId = await dialog.getAttribute('id');
  const listboxId = await listbox.getAttribute('id');
  if (!dialogId || !listboxId) throw new Error('Server Dialog or Listbox has no ID.');
  const errors: string[] = [];

  /** Retain page errors from attachment and selection. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(dialog).toHaveAttribute('id', dialogId);
  await expect(listbox).toHaveAttribute('id', listboxId);
  await expect(options.first()).toHaveAttribute('data-server-option', 'true');
  await expect(options.last()).toHaveAttribute('data-server-option', 'true');
  await expect(page.locator('style[data-listbox-default-css]')).toHaveCount(1);
  const search = dialog.getByRole('textbox', { name: 'Search apps or commands' });
  await expect(search).toBeFocused();
  await search.fill('Notíon');
  await expect(options).toHaveCount(1);
  await expect(options.first()).toHaveAccessibleName('Notion applications');
  await search.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByTestId('dialog-listbox-value')).toHaveText('notion');
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
}

test('published Dialog Listbox hydrates its portal and selection', verifiesDialogHydration);
