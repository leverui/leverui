import { expect, test, type Page } from '@playwright/test';

/** Verify a media query changes appearance without replacing Listbox state. */
async function verifiesResponsiveVariant({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-listbox--responsive');
  const root = page.getByTestId('listbox-responsive-root');
  const content = page.getByTestId('listbox-responsive-content');
  const options = content.getByRole('option');
  await expect(content).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(content).toHaveCSS('border-top-width', '0px');
  await expect(root).not.toHaveAttribute('variant');
  await expect(options).toHaveCount(4);
  const selected = options.nth(1);
  await selected.click();
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  const plainAppearance = await selected.evaluate(
    /** Read the selected card's plain colors before the media query changes. */
    (element) => ({
      background: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
    }),
  );
  await content.evaluate(
    /** Mark the live node to detect remounts after the viewport changes. */
    (element) => element.setAttribute('data-original-content', 'true'),
  );

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(content).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(content).toHaveCSS('border-top-width', '1px');
  await expect(content).toHaveAttribute('data-original-content', 'true');
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  const solidAppearance = await selected.evaluate(
    /** Read the solid selected-item colors, which subtle does not share. */
    (element) => ({
      background: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
    }),
  );
  expect(solidAppearance.background).not.toBe(plainAppearance.background);
  expect(solidAppearance.color).not.toBe(plainAppearance.color);
}

test('Listbox switches responsive CSS variants without remounting', verifiesResponsiveVariant);
