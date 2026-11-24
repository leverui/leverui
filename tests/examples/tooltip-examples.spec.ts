import { expect, test, type Page } from '@playwright/test';

const examples = [
  ['basic', 'Hover me'],
  ['controlled', 'Show tooltip'],
  ['controlled-multiple', 'Hover me'],
  ['multiple', 'Button 1'],
  ['arrow', 'Hover me'],
  ['with-checkbox', 'Weekly summary'],
  ['custom-bg', '3'],
  ['delay', 'Delay'],
  ['with-dialog', 'Edit profile'],
  ['disabled', 'Hover me'],
  ['interactive', 'Hover me'],
  ['with-menu-item', 'Open'],
  ['with-menu-trigger', 'Open'],
  ['offset', 'Hover me'],
  ['placement', 'Hover me'],
  ['with-store', 'Toggle'],
  ['with-switch', 'Auto-save'],
  ['with-tab', 'Members'],
] as const;

/** Require all named Tooltip stories to mount usable content. */
async function verifiesEveryTooltipExample({ page }: { page: Page }): Promise<void> {
  for (const [id, label] of examples) {
    await page.goto(`/iframe.html?id=components-tooltip--${id}`);
    await expect(page.locator('#storybook-root')).toContainText(label);
  }
  await page.goto('/iframe.html?id=components-tooltip--with-avatar');
  await expect(page.locator('#storybook-root img')).toBeAttached();
}

/** Check default hover, arrow, custom background, and disabled state. */
async function verifiesTooltipSurfaces({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--basic');
  await page.getByRole('button', { name: 'Hover me' }).hover();
  await expect(page.getByText('A short hint about this button')).toBeVisible();

  await page.goto('/iframe.html?id=components-tooltip--arrow');
  await page.getByRole('button', { name: 'Hover me' }).hover();
  await expect(page.locator('[data-tooltip-arrow]')).toBeVisible();

  await page.goto('/iframe.html?id=components-tooltip--custom-bg');
  await page.getByRole('button', { name: '3' }).hover();
  const content = page.locator('[data-tooltip-content]');
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS('background-color', 'rgb(255, 99, 71)');

  await page.goto('/iframe.html?id=components-tooltip--disabled');
  await page.getByRole('button', { name: 'Hover me' }).hover();
  await expect(page.locator('[data-tooltip-content]')).toHaveCount(0);
}

/** Verify controlled state and the caller-owned Tooltip machine. */
async function verifiesTooltipState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--controlled');
  await page.getByRole('button', { name: 'Show tooltip' }).hover();
  await expect(page.getByRole('button', { name: 'Hide tooltip' })).toBeVisible();
  await expect(page.getByText('A short hint about this button')).toBeVisible();

  await page.goto('/iframe.html?id=components-tooltip--with-store');
  const toggle = page.getByRole('button', { name: 'Toggle', exact: true });
  const storeContent = page.getByText('A short hint about this button');
  await toggle.click();
  await expect(storeContent).toBeVisible();
  await toggle.click();
  await expect(storeContent).not.toBeVisible();
}

/** Check Tooltips attached to the composite controls. */
async function verifiesCompositeTriggers({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--with-checkbox');
  await page.getByText('Weekly summary').hover();
  await expect(page.getByText('We send one email every Monday')).toBeVisible();
  await page.getByText('Weekly summary').click();
  await expect(page.locator('input[type="checkbox"]')).toBeChecked();

  await page.goto('/iframe.html?id=components-tooltip--with-switch');
  await page.getByText('Auto-save').hover();
  await expect(page.getByText('Saves your changes every few seconds')).toBeVisible();
  await page.getByText('Auto-save').click();
  await expect(page.locator('input[type="checkbox"]')).toBeChecked();

  await page.goto('/iframe.html?id=components-tooltip--with-avatar');
  await page.locator('#storybook-root img').hover();
  await expect(page.getByText('Mara Ellison is online')).toBeVisible();
}

/** Require nested dialog, menu, and tab examples to retain their interactions. */
async function verifiesNestedTriggers({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--with-dialog');
  const dialogTrigger = page.getByRole('button', { name: 'Edit profile' });
  await dialogTrigger.hover();
  await expect(page.getByText('Change your name and email')).toBeVisible();
  await dialogTrigger.click();
  await expect(page.getByText('Edit your profile')).toBeVisible();

  await page.goto('/iframe.html?id=components-tooltip--with-menu-item');
  await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('menuitem', { name: 'New text file' }).hover();
  await expect(page.getByText('Creates an empty .txt file')).toBeVisible();

  await page.goto('/iframe.html?id=components-tooltip--with-tab');
  await page.getByRole('tab', { name: 'Members' }).hover();
  await expect(page.getByText('See who is on your team')).toBeVisible();
  await page.getByRole('tab', { name: 'Projects' }).click();
  await expect(page.getByText('Create projects and archive old ones.')).toBeVisible();
}

/** Check sibling tooltips and ten separately controlled rows. */
async function verifiesMultipleTooltips({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--multiple');
  await page.getByRole('button', { name: 'Button 1' }).hover();
  await expect(page.getByText('Hint for button 1')).toBeVisible();
  await page.getByRole('button', { name: 'Button 2' }).hover();
  await expect(page.getByText('Hint for button 2')).toBeVisible();

  await page.goto('/iframe.html?id=components-tooltip--controlled-multiple');
  const rows = page.locator('#storybook-root [data-tooltip-trigger]');
  await expect(rows).toHaveCount(10);
  await rows.nth(0).hover();
  await expect(page.getByText('A short hint about this row')).toBeVisible();
}

/** Verify delayed opening and pointer entry into interactive content. */
async function verifiesTimingAndInteraction({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--delay');
  const delayed = page.getByText('This tooltip opens after half a second');
  // Time from before the hover, so a slow machine can only make the delay look longer.
  const hoverStart = Date.now();
  await page.getByRole('button', { name: /Delay/ }).hover();
  await expect(delayed).toBeVisible();
  expect(Date.now() - hoverStart).toBeGreaterThanOrEqual(450);

  await page.goto('/iframe.html?id=components-tooltip--interactive');
  await page.getByRole('button', { name: 'Hover me' }).hover();
  const content = page.locator('[data-tooltip-content]');
  await expect(content).toBeVisible();
  await content.hover();
  await expect(content).toBeVisible();
}

/** Check right-end placement and a menu trigger with both behaviors. */
async function verifiesPlacementAndMenuTrigger({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--placement');
  const trigger = page.getByRole('button', { name: 'Hover me' });
  await trigger.hover();
  const content = page.locator('[data-tooltip-content]');
  await expect(content).toBeVisible();
  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  if (!triggerBox || !contentBox) throw new Error('Tooltip geometry was unavailable.');
  expect(contentBox.x).toBeGreaterThan(triggerBox.x + triggerBox.width);

  await page.goto('/iframe.html?id=components-tooltip--with-menu-trigger');
  const menuTrigger = page.getByRole('button', { name: 'Open' });
  await menuTrigger.hover();
  await expect(page.getByText('Create or export a file')).toBeVisible();
  await menuTrigger.click();
  await expect(page.getByRole('menuitem', { name: 'New file...' })).toBeVisible();
}

/** Move the positioned surface on both axes with the offset. */
async function verifiesOffset({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--basic');
  await page.getByRole('button', { name: 'Hover me' }).hover();
  const basic = page.locator('[data-tooltip-content]');
  await expect(basic).toBeVisible();
  const basicBox = await basic.boundingBox();

  await page.goto('/iframe.html?id=components-tooltip--offset');
  await page.getByRole('button', { name: 'Hover me' }).hover();
  const offset = page.locator('[data-tooltip-content]');
  await expect(offset).toBeVisible();
  const offsetBox = await offset.boundingBox();
  if (!basicBox || !offsetBox) throw new Error('Tooltip geometry was unavailable.');
  expect(Math.abs(offsetBox.x - basicBox.x)).toBeGreaterThan(2);
  expect(Math.abs(offsetBox.y - basicBox.y)).toBeGreaterThan(2);
}

test('all Tooltip examples render', verifiesEveryTooltipExample);
test('Tooltip surfaces and disabled state work', verifiesTooltipSurfaces);
test('Tooltip controlled and store state work', verifiesTooltipState);
test('Tooltip composite triggers work', verifiesCompositeTriggers);
test('Tooltip nested triggers work', verifiesNestedTriggers);
test('Tooltip multiple roots remain independent', verifiesMultipleTooltips);
test('Tooltip timing and interactive surface work', verifiesTimingAndInteraction);
test('Tooltip placement and menu trigger work', verifiesPlacementAndMenuTrigger);
test('Tooltip offset moves both axes', verifiesOffset);
