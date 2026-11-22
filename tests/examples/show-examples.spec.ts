import { expect, test, type Page } from '@playwright/test';

/** Check the fourth click reveals the content and removes the fallback. */
async function verifiesInteractiveShow({ page }: { page: Page }): Promise<void> {
  for (const [story, content] of [
    ['basic', 'This line shows after four clicks.'],
    ['with-fallback', 'You made it. Here is the content.'],
  ] as const) {
    await page.goto(`/iframe.html?id=components-show--${story}`);
    const button = page.getByRole('button');
    await expect(button).toHaveText('Value: 0');
    await expect(page.getByText(content)).toHaveCount(0);
    if (story === 'with-fallback') {
      await expect(page.getByText('Not there yet. Keep clicking...')).toBeVisible();
    }
    for (let click = 0; click < 4; click += 1) await button.click();
    await expect(page.getByText(content)).toBeVisible();
    await expect(page.getByText('Not there yet. Keep clicking...')).toHaveCount(0);
  }
}

/** Check the render function receives and displays the narrowed value. */
async function verifiesRenderProp({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-show--with-render-prop');
  await expect(page.locator('#storybook-root')).toContainText('Value: 10');
}

test('Show Basic and WithFallback update after four clicks', verifiesInteractiveShow);
test('Show render prop displays the truthy value', verifiesRenderProp);
