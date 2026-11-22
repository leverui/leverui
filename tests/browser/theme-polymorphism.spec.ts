import { expect, test, type Page } from '@playwright/test';

/** Verify Theme preserves attributes, refs, styles, and events across both polymorphic paths. */
async function verifiesThemePolymorphism({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-theme-polymorphism--render-props');

  const section = page.getByTestId('section-theme');
  const child = page.getByTestId('child-theme');
  await expect(section).toBeVisible({ timeout: 30_000 });
  await expect(section).toHaveJSProperty('tagName', 'SECTION');
  await expect(section).toHaveAttribute('data-ref-tag', 'section');

  await expect(child).toHaveJSProperty('tagName', 'BUTTON');
  await expect(child).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(child).toHaveAttribute('data-parent-attribute', 'true');
  await expect(child).toHaveAttribute('data-parent-ref', 'true');
  await expect(child).toHaveAttribute('data-child-ref', 'true');
  await expect(child).toHaveClass(/leverui-theme/);
  await expect(child).toHaveClass(/parent-theme/);
  await expect(child).toHaveClass(/child-theme/);
  await expect(child).toHaveCSS('color', 'rgb(12, 34, 56)');
  await expect(child).toHaveCSS('border-top-width', '3px');

  await child.click();
  await expect(page.getByTestId('click-counts')).toHaveText('1:1');
  await expect(page.getByTestId('event-order')).toHaveText('child-parent');
}

test('Theme polymorphism forwards merged props and refs', verifiesThemePolymorphism);
