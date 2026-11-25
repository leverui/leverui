import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'context',
  'custom-container',
  'header-actions',
  'initial-focus',
  'offset',
  'placement',
  'conditional-variants',
  'sizes',
  'non-modal',
] as const;

/** Read a Drawer element's rendered width inside the browser. */
function readDrawerWidth(element: Element): number {
  return element.getBoundingClientRect().width;
}

/** Require every Drawer story to expose its trigger. */
async function verifiesEveryDrawerExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(240_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-drawer--${id}`);
    await expect(page.locator('#storybook-root button').first()).toBeVisible();
  }
}

/** Check the common panel and its close behavior. */
async function verifiesBasicDrawer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--basic');
  const trigger = page.getByRole('button', { name: 'Open drawer' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Save this filter')).toBeVisible();
  await expect(dialog.getByText(/This filter shows open orders/)).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toHaveCSS('position', 'absolute');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
}

/** Check the controlled Drawer opens from state and closes on Escape. */
async function verifiesControlledDrawer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--controlled');
  const trigger = page.getByRole('button', { name: 'Open drawer' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
}

/** Check context dismissal, the header actions, and email focus. */
async function verifiesDrawerActions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--context');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  await expect(page.getByText('Drawer is open: true')).toBeVisible();
  await page.getByText('Close', { exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  await page.goto('/iframe.html?id=components-drawer--header-actions');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button')).toHaveCount(3);
  await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toHaveCSS('position', 'static');

  await page.goto('/iframe.html?id=components-drawer--initial-focus');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  await expect(page.getByPlaceholder('Email')).toBeFocused();
}

/** Keep the custom Drawer inside its destination and offset another panel. */
async function verifiesDrawerPlacement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--custom-container');
  const container = page.getByText('Render drawer here').locator('..');
  await container.getByRole('button', { name: 'Open drawer' }).click();
  await expect(container.getByRole('dialog')).toBeVisible();

  await page.goto('/iframe.html?id=components-drawer--offset');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  const positioner = page.locator(
    '[data-dialog-positioner]:has([role="dialog"][data-state="open"])',
  );
  await expect(positioner).toHaveCSS('padding', '16px');
  await expect(page.getByRole('dialog')).toBeVisible();
}

/** Keep the caller-owned header close button in flow and preserve dismissal. */
async function verifiesHeaderCloseComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--header-actions');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: 'Close' });
  await expect(close).toHaveCSS('position', 'static');
  await close.click();
  await expect(dialog).toHaveCount(0);
}

/** Verify placement geometry and distinct size variants. */
async function verifiesDrawerMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer--placement');
  await expect(page.locator('#storybook-root button')).toHaveCount(4);
  const positioner = page.locator(
    '[data-dialog-positioner]:has([role="dialog"][data-state="open"])',
  );
  await page.getByRole('button', { name: 'Open (bottom)' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(positioner).toHaveCSS('align-items', 'flex-end');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Open (start)' }).click();
  await expect(positioner).toHaveCSS('justify-content', 'flex-start');

  await page.goto('/iframe.html?id=components-drawer--sizes');
  await expect(page.locator('#storybook-root button')).toHaveCount(6);
  await page.getByRole('button', { name: 'Open (xs)' }).click();
  const xsWidth = await page
    .locator('[role="dialog"][data-state="open"]')
    .evaluate(readDrawerWidth);
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Open (full)' }).click();
  const full = page.locator('[role="dialog"][data-state="open"]');
  await expect(full).toBeVisible();
  await expect
    .poll(
      /** Compare the full Drawer with the captured smallest width. */
      async () => full.evaluate(readDrawerWidth),
    )
    .toBeGreaterThan(xsWidth * 2);
}

/** Check responsive positioning and outside interaction in nonmodal mode. */
async function verifiesResponsiveAndNonModal({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/iframe.html?id=components-drawer--conditional-variants');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Press the')).toBeVisible();
  const positioner = page.locator('[data-dialog-positioner]');
  await expect(positioner).toHaveCSS('align-items', 'flex-end');

  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(positioner).toHaveCSS('justify-content', 'flex-end');
  await expect(positioner).toHaveCSS('align-items', 'stretch');
  await page.goto('/iframe.html?id=components-drawer--non-modal');
  await page.getByRole('button', { name: 'Open drawer' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.mouse.click(40, 200);
  await expect(dialog).toBeVisible();
}

test('all Drawer examples render', verifiesEveryDrawerExample);
test('Drawer Basic opens and returns focus', verifiesBasicDrawer);
test('Drawer Controlled follows Solid state', verifiesControlledDrawer);
test('Drawer context, header, and initial focus work', verifiesDrawerActions);
test('Drawer custom container and offset work', verifiesDrawerPlacement);
test(
  'Drawer header close composition keeps native style and behavior',
  verifiesHeaderCloseComposition,
);
test('Drawer placement and size examples open', verifiesDrawerMatrices);
test('Drawer responsive and nonmodal behavior works', verifiesResponsiveAndNonModal);
