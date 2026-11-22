import { expect, test, type Page } from '@playwright/test';

/** Verify CSS overrides, responsive orientation, and reactive primitive state. */
async function verifiesFieldCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-field-css--contract');
  const root = page.getByTestId('field-css-root');
  const label = page.getByTestId('field-css-label');
  const input = page.getByTestId('field-css-input');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(root).toHaveAttribute('data-orientation-md', 'horizontal');
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(label).toHaveCSS('color', 'rgb(21, 87, 156)');
  await expect(label).toHaveAttribute('for', 'css-field');

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(label).toHaveCSS('flex-basis', '96px');
  await root.evaluate(
    /** Mark the mounted root so reactive changes cannot silently replace it. */
    (element) => {
      (element as HTMLElement).dataset.original = 'true';
    },
  );
  await page.getByTestId('field-css-toggle').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('CSS error')).toBeVisible();

  const unstyled = page.getByTestId('field-css-unstyled-root');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).not.toHaveCSS('display', 'flex');
  const customLabel = page.getByTestId('field-css-unstyled-label');
  await expect(customLabel).toHaveAttribute('data-unstyled', '');
  await expect(customLabel).toHaveCSS('color', 'rgb(112, 37, 97)');
}

test('Field uses authored CSS while the primitive state remains reactive', verifiesFieldCss);

/** Verify each supported Field breakpoint can reverse the prior orientation. */
async function verifiesFieldBreakpoints({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field-css--contract');
  const root = page.getByTestId('field-css-breakpoints');
  const cases = [
    [400, 'column'],
    [600, 'row'],
    [800, 'column'],
    [1100, 'row'],
    [1300, 'column'],
    [1600, 'row'],
  ] as const;
  for (const [width, direction] of cases) {
    await page.setViewportSize({ width, height: 800 });
    await expect(root).toHaveCSS('flex-direction', direction);
  }
}

test('Field orientation follows every authored CSS breakpoint', verifiesFieldBreakpoints);
