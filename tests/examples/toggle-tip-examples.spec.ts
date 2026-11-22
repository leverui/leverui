import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'info-tip',
  'sizes',
  'arrow',
  'close-on-escape',
  'close-on-interact-outside',
] as const;

/** Require every Toggle Tip story to expose a trigger. */
async function verifiesEveryToggleTipExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-toggle-tip--${id}`);
    await expect(page.locator('#storybook-root button').first()).toBeVisible();
  }
}

/** Open the basic message and inspect the formatted file-size example. */
async function verifiesToggleTipContent({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle-tip--basic');
  await page.getByRole('button', { name: 'info' }).click();
  await expect(page.getByText('Changes are saved automatically.')).toBeVisible();

  await page.goto('/iframe.html?id=components-toggle-tip--info-tip');
  await expect(page.getByText(/File size:/)).toContainText('1.45');
  await page.getByRole('button', { name: 'info' }).click();
  await expect(page.getByText('This is the size of content.tsx before compression.')).toBeVisible();
}

/** Check the four sizes and the arrow's two rendered parts. */
async function verifiesToggleTipVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle-tip--sizes');
  await expect(page.locator('#storybook-root button')).toHaveCount(4);
  await page.locator('#storybook-root button').nth(3).click();
  await expect(page.getByText('This tip uses the "lg" size.')).toBeVisible();

  await page.goto('/iframe.html?id=components-toggle-tip--arrow');
  await page.getByRole('button', { name: 'info' }).click();
  await expect(page.locator('[data-popover-arrow]')).toBeVisible();
  await expect(page.locator('[data-popover-arrow-tip]')).toBeAttached();
}

/** Honor the two opt-out rules for closing an open Toggle Tip. */
async function verifiesToggleTipClosing({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle-tip--close-on-escape');
  await page.getByRole('button', { name: 'info' }).click();
  const escapeMessage = page.getByText('This tip stays open when you press Escape.');
  await expect(escapeMessage).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(escapeMessage).toBeVisible();

  await page.goto('/iframe.html?id=components-toggle-tip--close-on-interact-outside');
  await page.getByRole('button', { name: 'info' }).click();
  const outsideMessage = page.getByText('This tip stays open when you click outside it.');
  await expect(outsideMessage).toBeVisible();
  await page.mouse.click(500, 350);
  await expect(outsideMessage).toBeVisible();
}

test('all Toggle Tip examples render', verifiesEveryToggleTipExample);
test('Toggle Tip content and formatted value match', verifiesToggleTipContent);
test('Toggle Tip sizes and arrow render', verifiesToggleTipVariants);
test('Toggle Tip closing preferences work', verifiesToggleTipClosing);
