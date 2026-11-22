import { expect, test, type Page } from '@playwright/test';
import { scanWcagViolations } from './axe-scan';

/** Verify the menu content remains accessible on the native scroll node. */
async function verifiesMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-menu--composition');
  await page.getByRole('button', { name: 'Open scrollable menu' }).click();
  const content = page.getByTestId('scroll-menu-content');
  await expect(content).toHaveAttribute('role', 'menu');
  await expect(content).toHaveAttribute('data-scroll-area-viewport');
  await expect(content).toHaveAttribute('data-overflow-y', '');
  await expect(page.getByRole('menuitem')).toHaveCount(24);
  await content.hover();
  await page.mouse.wheel(0, 220);
  await expect
    .poll(
      /** Wait for the composed menu viewport to respond to a wheel gesture. */
      () =>
        content.evaluate(
          /** Read the menu viewport's native position. */
          (element) => element.scrollTop,
        ),
    )
    .toBeGreaterThan(0);
  const violations = await scanWcagViolations(page);
  expect(violations).toEqual([]);

  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Menu item 24' })).toHaveAttribute(
    'data-highlighted',
    '',
  );
  await expect
    .poll(
      /** Wait for keyboard navigation to bring the final item into view. */
      () =>
        content.evaluate(
          /** Read the menu viewport after focus moves. */
          (element) => element.scrollTop,
        ),
    )
    .toBeGreaterThan(220);
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open scrollable menu' })).toBeFocused();
}

test('ScrollArea composes with Menu on one scrollable node', verifiesMenu);
