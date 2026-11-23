import { expect, test } from '@playwright/test';

/** Verify each hosted Command size opens and changes the input dimensions. */
test('Command sizes apply distinct CSS dimensions', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--sizes');
  const heights: number[] = [];
  const measurements = {
    sm: { inputHeight: '40px', controlPadding: '12px' },
    md: { inputHeight: '48px', controlPadding: '16px' },
    lg: { inputHeight: '56px', controlPadding: '20px' },
  } as const;

  for (const size of ['sm', 'md', 'lg'] as const) {
    await page.getByRole('button', { name: `Search... (size=${size})` }).click();
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    const input = dialog.getByRole('combobox');
    const control = dialog.locator('.leverui-command__control');
    await expect(dialog.getByRole('option')).toHaveCount(4);
    await expect(input).toHaveCSS('height', measurements[size].inputHeight);
    await expect(control).toHaveCSS('padding-left', measurements[size].controlPadding);
    heights.push(await input.evaluate((element) => element.getBoundingClientRect().height));
    await input.press('Escape');
    await expect(dialog).toHaveCount(0);
  }

  expect(heights[0]).toBeLessThan(heights[1] ?? 0);
  expect(heights[1]).toBeLessThan(heights[2] ?? 0);
});

/** A theme-level public variable must override Command's private size defaults. */
test('Command honors a root-scope CSS variable', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--sizes');
  await page.addStyleTag({ content: ':root { --lui-command-control-padding-x: 37px; }' });
  await page.getByRole('button', { name: 'Search... (size=md)' }).click();
  const control = page
    .getByRole('dialog', { name: 'Command palette' })
    .locator('.leverui-command__control');
  await expect(control).toHaveCSS('padding-left', '37px');
  await expect(control).toHaveCSS('padding-right', '37px');
});
