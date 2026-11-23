import { expect, test, type Locator, type Page } from '@playwright/test';

const viewportSteps = [
  { width: 400, height: '32px', topBorder: '1px' },
  { width: 600, height: '36px', topBorder: '1px' },
  { width: 800, height: '40px', topBorder: '0px' },
  { width: 1100, height: '44px', topBorder: '1px' },
  { width: 1300, height: '32px', topBorder: '1px' },
  { width: 1600, height: '44px', topBorder: '0px' },
] as const;

/** Read the selected control appearance after a breakpoint change. */
async function readControl(
  root: Locator,
): Promise<{ minHeight: string; borderTopWidth: string; background: string }> {
  return root.locator('.lui-tags-input__control').evaluate(
    /** Sample the public part's visible CSS presentation. */
    (element) => {
      const style = getComputedStyle(element);
      return {
        minHeight: style.minHeight,
        borderTopWidth: style.borderTopWidth,
        background: style.backgroundColor,
      };
    },
  );
}

/** Require finite choices to render from CSS at every breakpoint. */
async function verifiesResponsiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tags-input-css--contract');
  const root = page.getByTestId('tags-css-responsive');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-size', 'xs');
  await expect(root).toHaveAttribute('data-size-2xl', 'lg');
  await expect(root).toHaveAttribute('data-variant', 'outline');
  await expect(root).toHaveAttribute('data-variant-2xl', 'flushed');
  await expect(root).toHaveAttribute('data-lui-color-palette', 'blue');
  const backgrounds: string[] = [];
  for (const { width, height, topBorder } of viewportSteps) {
    await page.setViewportSize({ width, height: 800 });
    const control = await readControl(root);
    expect(control.minHeight, `${width}px height`).toBe(height);
    expect(control.borderTopWidth, `${width}px border`).toBe(topBorder);
    backgrounds.push(control.background);
  }
  expect(backgrounds[0]).not.toBe(backgrounds[1]);
  expect(backgrounds[1]).not.toBe(backgrounds[2]);
  expect(backgrounds[0]).toBe(backgrounds[3]);
  expect(backgrounds[1]).toBe(backgrounds[4]);
  expect(backgrounds[2]).toBe(backgrounds[5]);
}

test('responsive Tags Input sizes and variants use authored CSS', verifiesResponsiveAppearance);

/** Keep the primitive values and native nodes while appearance props change. */
async function verifiesReactiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tags-input-css--contract');
  const root = page.getByTestId('tags-css-reactive');
  const control = root.locator('.lui-tags-input__control');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-size', 'sm');
  await control.evaluate(
    /** Mark the original control to detect an accidental remount. */
    (element) => {
      (element as HTMLElement).dataset.original = 'true';
    },
  );
  await page.getByTestId('tags-css-toggle').click();
  await expect(root).toHaveAttribute('data-size', 'lg');
  await expect(root).toHaveAttribute('data-variant', 'subtle');
  await expect(control).toHaveAttribute('data-original', 'true');
  await expect(control).toHaveCSS('min-height', '44px');
}

test(
  'Tags Input appearance updates without replacing its primitive control',
  verifiesReactiveAppearance,
);

/** Verify public tokens, classes, and unstyled composition in one page. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=internal-tags-input-css--contract');
  const root = page.getByTestId('tags-css-responsive');
  const preview = root.locator('.lui-tags-input__itemPreview');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: `[data-testid='tags-css-responsive'] {
      --lui-colors-color-palette-subtle: rgb(10 90 150);
    }`,
  });
  await expect(preview).toHaveCSS('background-color', 'rgb(10, 90, 150)');
  await page.addStyleTag({
    content: `[data-testid='tags-css-responsive'] .lui-tags-input__control {
      background: rgb(20 30 40);
    }`,
  });
  await expect(root.locator('.lui-tags-input__control')).toHaveCSS(
    'background-color',
    'rgb(20, 30, 40)',
  );
  const unstyled = page.getByTestId('tags-css-unstyled');
  await expect(unstyled.locator('.lui-tags-input__control')).not.toHaveCSS('min-height', '40px');
  await expect(unstyled.locator('.lui-tags-input__item')).toHaveCount(1);
}

test('consumer CSS and unstyled Tags Input keep stable part hooks', verifiesConsumerCss);
