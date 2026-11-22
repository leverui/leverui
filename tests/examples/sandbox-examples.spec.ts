import { expect, test, type Page } from '@playwright/test';

/** Load one Sandbox story in the public Storybook iframe. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=foundations-sandbox--${id}`);
  await expect(page.locator('#storybook-root')).toBeVisible();
}

/** Check the visual and structural content of each example. */
async function checksExamples({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'color-palette');
  await expect(page.getByText('Welcome to the', { exact: false })).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Click me' })).toHaveCount(3);
  await openStory(page, 'self-closing');
  const image = page.getByRole('img', { name: 'Portrait of a man' });
  await expect(image).toBeVisible();
  await expect(image).toHaveCSS('border-radius', /[1-9]/);
  await openStory(page, 'layers');
  await expect(page.getByRole('button', { name: 'Click me' })).toBeVisible();
  await openStory(page, 'sort-order');
  await expect(page.getByText('Hello')).toBeVisible();
  await openStory(page, 'custom-animation');
  await expect(page.getByTestId('sandbox-texture')).toHaveCSS(
    'animation-name',
    'leverui-sandbox-fade',
  );
}

/** Verify the responsive display used by the SortOrder specimen. */
async function checksSortOrder({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await openStory(page, 'sort-order');
  await expect(page.getByText('Hello')).toBeHidden();
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.getByText('Hello')).toBeVisible();
}

/** Ensure style changes preserve both mounted timestamp components. */
async function checksReRenders({ page }: { page: Page }): Promise<void> {
  await openStory(page, 're-renders');
  const stamps = page.getByTestId('sandbox-timestamp');
  await expect(stamps).toHaveCount(2);
  const before = await stamps.allTextContents();
  const box = page.getByTestId('sandbox-color-box');
  const blue = await box.evaluate(
    /** Read the actual token-resolved color before changing the signal. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.getByRole('button', { name: 'Re-render' }).click();
  expect(await stamps.allTextContents()).toEqual(before);
  const red = await box.evaluate(
    /** Read the new color from the same mounted box. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(red).not.toBe(blue);
}

test('Sandbox examples preserve the content and animation', checksExamples);
test('Sandbox style updates retain mounted content', checksReRenders);
test('Sandbox SortOrder responds to viewport width', checksSortOrder);
