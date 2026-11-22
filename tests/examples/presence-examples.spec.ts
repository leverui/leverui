import { expect, test, type Page } from '@playwright/test';

/** Verify each animation variant opens and closes through its button. */
async function verifiesPresenceMotion({ page }: { page: Page }): Promise<void> {
  for (const [story, label] of [
    ['fade', 'Fade'],
    ['scale-fade', 'Scale fade'],
    ['slide', 'Slide'],
    ['slide-fade', 'Slide fade'],
  ] as const) {
    await page.goto(`/iframe.html?id=components-presence--${story}`);
    const panel = page.locator('[data-presence-root]');
    await page.getByRole('button', { name: 'Click me' }).click();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(label);
    await page.getByRole('button', { name: 'Click me' }).click();
    await expect(panel).toBeHidden();
  }
}

/** Distinguish lazy initial absence from unmounting after the exit. */
async function verifiesPresenceMounting({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-presence--lazy-mount');
  const lazy = page.locator('[data-presence-root]');
  await expect(lazy).toHaveCount(0);
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(lazy).toBeVisible();

  await page.goto('/iframe.html?id=components-presence--unmount-on-exit');
  const exit = page.locator('[data-presence-root]');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(exit).toBeVisible();
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(exit).toHaveCount(0);
}

test('Presence motion examples preserve entry and exit', verifiesPresenceMotion);
test('Presence mounting examples preserve DOM lifecycle', verifiesPresenceMounting);
