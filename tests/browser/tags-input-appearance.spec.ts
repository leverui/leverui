import { expect, test, type Page } from '@playwright/test';

const heights = {
  xs: '32px',
  sm: '36px',
  md: '40px',
  lg: '44px',
} as const;

/** Check every recipe size and variant plus direct consumer CSS precedence. */
async function verifiesTagsInputAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-appearance--matrix');
  for (const [size, minHeight] of Object.entries(heights)) {
    for (const variant of ['outline', 'subtle', 'flushed']) {
      const root = page.getByTestId(`tags-input-matrix-${size}-${variant}`);
      await expect(root).toBeVisible({ timeout: 30_000 });
      const actual = await root.locator('.leverui-tags-input__control').evaluate(
        /** Read the resolved control height from the active recipe. */
        (element) => getComputedStyle(element).minHeight,
      );
      expect(actual).toBe(minHeight);
      await expect(root.locator('.leverui-tags-input__itemText')).toHaveText('Solid');
    }
  }
  const override = await page.getByTestId('tags-input-css-override-control').evaluate(
    /** Confirm consumer CSS can override the generated slot recipe. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(override).toBe('rgb(1, 99, 222)');
}

test('Tags Input applies every recipe combination and consumer CSS', verifiesTagsInputAppearance);

/** Compare border, focus, item, and readonly recipe outcomes. */
async function verifiesReferenceStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-appearance--matrix');
  const outline = page
    .getByTestId('tags-input-matrix-md-outline')
    .locator('.leverui-tags-input__control');
  const subtle = page
    .getByTestId('tags-input-matrix-md-subtle')
    .locator('.leverui-tags-input__control');
  const flushed = page
    .getByTestId('tags-input-matrix-md-flushed')
    .locator('.leverui-tags-input__control');
  await expect(outline).toHaveCSS('border-top-width', '1px', { timeout: 30_000 });
  await expect(subtle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  await expect(flushed).toHaveCSS('border-top-width', '0px');
  await expect(flushed).toHaveCSS('border-bottom-width', '1px');
  await expect(
    page.getByTestId('tags-input-matrix-md-outline').locator('.leverui-tags-input__itemPreview'),
  ).toHaveCSS('height', '28px');
  const outlineItemColor = await page
    .getByTestId('tags-input-matrix-md-outline')
    .locator('.leverui-tags-input__itemPreview')
    .evaluate(
      /** Read the actual palette fill selected by the outline recipe. */
      (element) => getComputedStyle(element).backgroundColor,
    );
  const subtleItemColor = await page
    .getByTestId('tags-input-matrix-md-subtle')
    .locator('.leverui-tags-input__itemPreview')
    .evaluate(
      /** Read the distinct item fill selected by the subtle recipe. */
      (element) => getComputedStyle(element).backgroundColor,
    );
  expect(outlineItemColor).not.toBe(subtleItemColor);
  await outline.locator('.leverui-tags-input__input').focus();
  await expect(outline).toHaveCSS('outline-style', 'solid');
  await expect(outline).toHaveCSS('outline-width', '1px');

  await page.goto('/iframe.html?id=components-tags-input--states');
  await expect(page.getByPlaceholder('Readonly input')).toHaveCSS('display', 'none');
  const invalid = page.getByPlaceholder('Required input').locator('..');
  await expect(invalid).toHaveAttribute('data-invalid', '');
  await expect(invalid).toHaveCSS('border-top-width', '1px');
  const disabledBorderColor = await page
    .getByPlaceholder('Disabled input')
    .locator('..')
    .evaluate(
      /** Read the noninvalid outline border as the recipe-state baseline. */
      (element) => getComputedStyle(element).borderTopColor,
    );
  const invalidBorderColor = await invalid.evaluate(
    /** Read the error border applied by the invalid recipe state. */
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(invalidBorderColor).not.toBe(disabledBorderColor);
}

test('Tags Input renders focus, invalid, readonly, and variant styles', verifiesReferenceStates);

/** Keep the wrapping field inside a narrow viewport. */
async function verifiesResponsiveWrap({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/iframe.html?id=components-tags-input-appearance--matrix');
  const root = page.getByTestId('tags-input-matrix-md-outline');
  await expect(root).toBeVisible({ timeout: 30_000 });
  const fitsViewport = await root.evaluate(
    /** Compare the actual rendered control width with the mobile viewport. */
    (element) => element.getBoundingClientRect().right <= window.innerWidth,
  );
  expect(fitsViewport).toBe(true);
}

test('Tags Input wraps within a narrow viewport', verifiesResponsiveWrap);
