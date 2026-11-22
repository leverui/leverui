import { expect, test, type Page } from '@playwright/test';

/** Open a createOverlay story in Storybook's rendered canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=hooks-createoverlay--${id}`);
  await expect(page.locator('#storybook-root')).toBeVisible();
}

/** Open and dismiss the shared dialog through its native Escape behavior. */
async function checksBasic({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText(
    'You have three new messages since your last visit.',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

/** Keep a mounted overlay reactive when its props change. */
async function checksUpdate({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'update');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toContainText('Checking for updates');
  await expect(page.getByRole('dialog')).toContainText('You are up to date');
  await expect(page.getByRole('dialog')).toContainText('nothing to download');
}

/** Open the follow-up dialog with the first overlay's return value. */
async function checksReturnValue({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'return-value');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toContainText(
    'The first dialog passed this title along when it closed.',
  );
  await expect(page.getByRole('dialog')).toContainText('Welcome');
}

/** Verify the destructive alert preserves cancel and confirmation choices. */
async function checksAlert({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'alert');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('alertdialog')).toContainText('Are you sure?');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
}

/** Verify the Drawer appears with the placement and copy. */
async function checksDrawer({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'drawer');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  await expect(page.getByRole('dialog')).toContainText('Order summary');
  await expect(page.getByRole('dialog')).toContainText(
    'Two items, shipping on Friday. The total is $48.',
  );
}

/** Submit a native form, greet the entered name, and close its overlay. */
async function checksForm({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'form');
  await page.getByRole('button', { name: 'Open form' }).click();
  await page.getByPlaceholder('Enter your name').fill('Justin');
  page.once(
    'dialog',
    /** Check the greeting and dismiss the browser alert. */
    async (dialog) => {
      expect(dialog.message()).toBe('Hello Justin!');
      await dialog.dismiss();
    },
  );
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

/** Open the nested action menu from the first menu's dialog action. */
async function checksMenuItem({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'menu-item');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Show more' }).click();
  await expect(page.getByRole('dialog')).toContainText('Welcome');
  await page.getByRole('button', { name: 'More actions' }).click();
  await expect(page.getByRole('menuitem', { name: 'New text file' })).toBeVisible();
}

test('createOverlay Basic opens and dismisses a dialog', checksBasic);
test('createOverlay Update changes a mounted dialog', checksUpdate);
test('createOverlay ReturnValue opens a follow-up dialog', checksReturnValue);
test('createOverlay Alert supports cancellation and confirmation', checksAlert);
test('createOverlay Drawer opens in the expected placement', checksDrawer);
test('createOverlay Form submits and closes', checksForm);
test('createOverlay MenuItem opens a dialog and nested menu', checksMenuItem);
