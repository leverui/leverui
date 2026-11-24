import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'open-from-menu',
  'open-from-popover',
  'controlled',
  'multiple-triggers',
  'nested',
  'non-modal',
  'backdrop-blur',
  'close-outside',
  'context',
  'cover',
  'datalist',
  'final-focus',
  'fullscreen',
  'initial-focus',
  'inside-scroll',
  'outside-scroll',
  'motion-preset',
  'placement',
  'responsive-size',
  'role',
  'sizes',
  'store',
] as const;

/** Require every story to render its visible entry control. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  test.setTimeout(480_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-dialog--${id}`);
    await expect(page.getByRole('button').first()).toBeVisible();
  }
}

/** Check the usual panel copy and action dismissal. */
async function verifiesBasicAndControlled({ page }: { page: Page }): Promise<void> {
  for (const id of ['basic', 'controlled']) {
    await page.goto(`/iframe.html?id=components-dialog--${id}`);
    await page
      .getByRole('button', { name: /Open dialog|Open/ })
      .first()
      .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Sharing settings' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
  }
}

/** Preserve trigger values, nested context, and externally owned state. */
async function verifiesMachineCompositions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog--multiple-triggers');
  await page.getByRole('button', { name: 'Edit Bob Okonkwo' }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Edit Bob Okonkwo' }),
  ).toBeVisible();

  await page.goto('/iframe.html?id=components-dialog--nested');
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await page.getByRole('button', { name: 'Open nested' }).click();
  await expect(page.locator('[role="dialog"]')).toHaveCount(2);
  await expect(page.getByRole('dialog')).toHaveCount(1);

  await page.goto('/iframe.html?id=components-dialog--context');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByText('Dialog is open: true')).toBeVisible();
  await page.getByRole('dialog').getByText('Close', { exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.goto('/iframe.html?id=components-dialog--store');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.locator('[data-dialog-trigger]')).toContainText('Close dialog');
}

/** Open a modal through each overlay composition. */
async function verifiesOverlaySources({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog--open-from-menu');
  await page.getByRole('button', { name: /Actions/ }).click();
  await page.getByRole('menuitem', { name: 'Delete...' }).click();
  await expect(
    page.getByRole('alertdialog').getByRole('heading', { name: 'Confirm delete' }),
  ).toBeVisible();

  await page.goto('/iframe.html?id=components-dialog--open-from-popover');
  await page.getByRole('button', { name: 'Open popover' }).click();
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Dialog from a popover' }),
  ).toBeVisible();
}

/** Verify initial and final focus targets around the modal lifecycle. */
async function verifiesFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog--initial-focus');
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByPlaceholder('This field gets focus first')).toBeFocused();

  await page.goto('/iframe.html?id=components-dialog--final-focus');
  await page.getByRole('button', { name: 'Open' }).click();
  await page.locator('[data-dialog-close-trigger]').click();
  await expect(page.getByLabel('Focus moved to this box')).toBeFocused();
}

/** Check recipe variants and task details in their opened panels. */
async function verifiesVariantsAndDetails({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog--role');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(
    page.getByRole('alertdialog').getByRole('heading', { name: 'Are you sure?' }),
  ).toBeVisible();

  await page.goto('/iframe.html?id=components-dialog--datalist');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Prepare the August release' })).toBeVisible();
  await expect(dialog.getByPlaceholder('Add a note')).toBeVisible();

  await page.goto('/iframe.html?id=components-dialog--sizes');
  await expect(page.getByRole('button', { name: /^Open \(/ })).toHaveCount(4);
  await page.getByRole('button', { name: 'Open (xs)' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goto('/iframe.html?id=components-dialog--placement');
  await expect(page.getByRole('button', { name: /^Open dialog \(/ })).toHaveCount(3);
}

/** Open the remaining layout stories and verify their distinct content. */
async function verifiesLayoutStories({ page }: { page: Page }): Promise<void> {
  for (const id of ['non-modal', 'backdrop-blur', 'close-outside', 'cover', 'fullscreen']) {
    await page.goto(`/iframe.html?id=components-dialog--${id}`);
    await page
      .getByRole('button', { name: /Open dialog/ })
      .first()
      .click();
    await expect(page.getByRole('dialog')).toBeVisible();
    if (id === 'non-modal') {
      await expect(page.locator('[data-dialog-backdrop]')).toHaveCount(0);
    }
    if (id === 'close-outside') {
      await expect(page.locator('iframe[title="Sample video"]')).toBeVisible();
    }
  }

  for (const id of ['inside-scroll', 'outside-scroll']) {
    await page.goto(`/iframe.html?id=components-dialog--${id}`);
    await page.getByRole('button', { name: /scroll/ }).click();
    await expect(page.getByRole('dialog').locator('p')).toHaveCount(8);
  }
}

/** Confirm modal geometry responds to placement, size, and viewport. */
async function verifiesResponsiveGeometry({ page }: { page: Page }): Promise<void> {
  const positions: number[] = [];
  for (const placement of ['top', 'center', 'bottom']) {
    await page.goto('/iframe.html?id=components-dialog--placement');
    await page.getByRole('button', { name: `Open dialog (${placement})` }).click();
    const bounds = await page.getByRole('dialog').boundingBox();
    if (!bounds) throw new Error(`Missing ${placement} Dialog bounds.`);
    positions.push(bounds.y);
  }
  expect(positions[0]).toBeLessThan(positions[1] ?? 0);
  expect(positions[1]).toBeLessThan(positions[2] ?? 0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/iframe.html?id=components-dialog--responsive-size');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const mobile = await page.getByRole('dialog').boundingBox();
  if (!mobile) throw new Error('Missing mobile Dialog bounds.');
  expect(mobile.width).toBeGreaterThanOrEqual(390 * 0.9);

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-dialog--responsive-size');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const desktop = await page.getByRole('dialog').boundingBox();
  if (!desktop) throw new Error('Missing desktop Dialog bounds.');
  expect(desktop.width).toBeLessThan(800);
}

test('all Dialog examples render', verifiesInventory);
test('Dialog basic and controlled stories dismiss through Cancel', verifiesBasicAndControlled);
test('Dialog trigger values and nested state work', verifiesMachineCompositions);
test('Dialog opens from Menu and Popover', verifiesOverlaySources);
test('Dialog initial and final focus work', verifiesFocus);
test('Dialog variants and task details render', verifiesVariantsAndDetails);
test('Dialog layout examples open with their content', verifiesLayoutStories);
test('Dialog placement and responsive size change geometry', verifiesResponsiveGeometry);
