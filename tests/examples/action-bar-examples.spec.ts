import { expect, test, type Page } from '@playwright/test';

const exampleIds = ['basic', 'close-trigger', 'with-dialog', 'placement'] as const;

/** Require each Action Bar example to mount its starting control. */
async function verifiesEveryActionBarExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-action-bar--${id}`);
    const control =
      id === 'placement'
        ? page.getByRole('button', { name: 'Show action bar' })
        : page.getByRole('checkbox');
    await expect(control, `Action Bar example ${id} should render`).toBeVisible({
      timeout: 45_000,
    });
  }
}

/** Verify selection shows the bar and its two actions. */
async function verifiesBasicSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar--basic');
  await page.getByText('Show action bar').click();
  await expect(page.getByRole('button', { name: '2 selected' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
}

/** Verify dismissal clears the checkbox controlling the bar. */
async function verifiesCloseTrigger({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar--close-trigger');
  const checkbox = page.getByRole('checkbox', { name: 'Show action bar' });
  await page.getByText('Show action bar').click();
  await expect(page.getByRole('button', { name: '2 selected' })).toBeVisible();
  await page.locator('[class*="action-bar__closeTrigger"]').click();
  await expect(checkbox).not.toBeChecked();
}

/** Verify the destructive action opens its confirmation dialog. */
async function verifiesDialogTrigger({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar--with-dialog');
  await page.getByText('Check to select projects').click();
  await page.getByRole('button', { name: 'Delete projects' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete projects' })).toBeVisible();
  await expect(page.getByText('Are you sure you want to delete 4 projects?')).toBeVisible();
}

/** Verify the placement choices control the visible bar's alignment. */
async function verifiesPlacement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar--placement');
  await page.getByRole('button', { name: 'Show action bar' }).click();
  await expect(page.getByRole('button', { name: '3 selected' })).toBeVisible();
  await page.getByText('Bottom end', { exact: true }).click();
  await expect(page.locator('[class*="action-bar__positioner"]')).toHaveCSS(
    'justify-content',
    'flex-end',
  );
}

test('all Action Bar examples render', verifiesEveryActionBarExample);
test('basic Action Bar shows selection actions', verifiesBasicSelection);
test('Action Bar close trigger clears selection', verifiesCloseTrigger);
test('Action Bar dialog action opens confirmation', verifiesDialogTrigger);
test('Action Bar placement choices update alignment', verifiesPlacement);
