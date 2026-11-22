import { expect, test, type Page } from '@playwright/test';

/** Verify clipped styling keeps native content accessible and interactive. */
async function verifiesVisuallyHiddenContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-visually-hidden--contract');
  const notification = page.getByTestId('notification-label');
  const search = page.getByTestId('hidden-search');
  const label = page.getByTestId('hidden-label');

  await expect(page.getByRole('button', { name: '3 Notifications' })).toBeVisible();
  await expect(notification).toHaveCSS('position', 'absolute');
  await expect(notification).toHaveCSS('clip', 'rect(0px, 0px, 0px, 0px)');
  await expect(notification).toHaveCSS('width', '1px');
  await expect(notification).toHaveCSS('height', '1px');
  await expect(notification).toHaveCSS('overflow', 'hidden');
  await expect(notification).not.toHaveAttribute('aria-hidden');
  await expect(notification).not.toHaveAttribute('hidden');

  await expect(page.getByRole('textbox', { name: 'Search messages' })).toHaveCount(1);
  await expect(search).toHaveCSS('clip', 'rect(0px, 0px, 0px, 0px)');
  await expect(search).toHaveAttribute('data-parent', 'hidden-input');
  await expect(search).toHaveAttribute('data-parent-ref', 'input');
  await expect(search).toHaveClass(/search-child/);
  await expect(search).toHaveClass(/leverui-visually-hidden/);
  await expect(page.locator('[data-testid="visually-hidden-story"] > span')).toHaveCount(0);
  await page.getByTestId('notification-button').focus();
  await page.keyboard.press('Tab');
  await expect(search).toBeFocused();
  await page.keyboard.type('hello');
  await expect(search).toHaveValue('hello');

  await expect(label).toHaveCSS('width', '1px');
  await expect(label).toHaveAttribute('for', 'visible-search');
  await page.getByTestId('hidden-width-toggle').click();
  await expect(label).toHaveCSS('width', '2px');
  await expect(page.getByTestId('visible-search')).toHaveAttribute('id', 'visible-search');
  await page.addStyleTag({ content: '.leverui-visually-hidden { width: 5px; }' });
  await expect(label).toHaveCSS('width', '5px');
}

test(
  'VisuallyHidden preserves accessibility, focus, and reactive styles',
  verifiesVisuallyHiddenContract,
);
