import { expect, test, type Page } from '@playwright/test';

/** Verify click selection, default parts, native semantics, and dismissal. */
async function verifiesMenuSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu--contract');
  const trigger = page.getByTestId('menu-trigger');
  const content = page.getByTestId('menu-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'menu');
  await expect(content).toHaveAttribute('data-ref-seen', 'true');
  await expect(content).toHaveClass(/menu__content/);
  await expect(content).toHaveCSS('padding', '6px');
  await expect(page.getByTestId('menu-arrow').locator('[data-menu-arrow-tip]')).toHaveCount(1);
  await expect(page.getByTestId('menu-separator')).toHaveJSProperty('tagName', 'HR');
  await expect(page.getByText('⌘R')).toHaveJSProperty('tagName', 'KBD');
  await expect(page.getByTestId('menu-archive')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByTestId('menu-help')).toHaveJSProperty('tagName', 'A');
  await expect(page.getByTestId('menu-help')).toHaveAttribute('href', '#menu-destination');
  await page.getByTestId('menu-rename').click();
  await expect(page.getByTestId('menu-selected')).toHaveText('rename');
  await expect(content).toHaveCount(0);
}

test('Menu composes the primitive selection with Lever UI slots', verifiesMenuSelection);

/** Verify keyboard opening, disabled item skipping, and focus return. */
async function verifiesMenuKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu--contract');
  const trigger = page.getByTestId('menu-trigger');
  const content = page.getByTestId('menu-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(content).toBeVisible();
  await expect(content).toBeFocused();
  await expect(page.getByTestId('menu-rename')).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('menu-delete')).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Menu keeps the primitive keyboard movement and focus return', verifiesMenuKeyboard);

/** Verify non-default geometry and pointer dismissal without stealing outside focus. */
async function verifiesMenuPlacementAndOutsideDismissal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu--placement');
  const trigger = page.getByTestId('menu-placement-trigger');
  const content = page.getByTestId('menu-placement-content');
  const outside = page.getByTestId('menu-outside-target');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-placement', 'left-start');

  const triggerBounds = await trigger.boundingBox();
  const contentBounds = await content.boundingBox();
  if (!triggerBounds || !contentBounds) throw new Error('Visible menu geometry is unavailable.');
  expect(contentBounds.x + contentBounds.width).toBeLessThanOrEqual(triggerBounds.x + 1);
  expect(Math.abs(contentBounds.y - triggerBounds.y)).toBeLessThan(3);

  await outside.click();
  await expect(content).toHaveCount(0);
}

test(
  'Menu honors placement and dismisses on an outside click',
  verifiesMenuPlacementAndOutsideDismissal,
);

/** Preserve both refs and keyboard dismissal on caller-owned content. */
async function verifiesMenuAsChild({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu--as-child');
  const trigger = page.getByTestId('menu-child-trigger');
  const content = page.getByTestId('menu-child-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(content).toBeVisible();
  await expect(content).toHaveJSProperty('tagName', 'SECTION');
  await expect(content).toHaveAttribute('role', 'menu');
  await expect(content).toHaveAttribute('data-parent-ref', 'true');
  await expect(content).toHaveAttribute('data-child-ref', 'true');
  await expect(content).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Menu preserves asChild refs and Escape focus', verifiesMenuAsChild);

/** Keep Escape focus tied to Zag's trigger when the accessible label changes. */
async function verifiesMenuCustomLabelFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu--custom-label');
  const trigger = page.getByTestId('menu-labeled-trigger');
  const content = page.getByTestId('menu-labeled-content');
  const label = page.getByTestId('menu-custom-label');
  await expect(trigger).toBeVisible({ timeout: 30_000 });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('aria-labelledby', 'menu-custom-label');
    await expect(content).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(content).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(label).not.toBeFocused();
  }
}

test('Menu returns focus to its trigger with a custom content label', verifiesMenuCustomLabelFocus);
