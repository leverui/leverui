import { expect, test, type Page } from '@playwright/test';

const cases = [
  { pattern: 'up', width: 420, maxWidth: '420px', size: 'full' },
  { pattern: 'up', width: 500, maxWidth: '500px', size: 'cover' },
  { pattern: 'up', width: 800, maxWidth: '384px', size: 'xs' },
  { pattern: 'up', width: 1100, maxWidth: '448px', size: 'sm' },
  { pattern: 'up', width: 1300, maxWidth: '512px', size: 'md' },
  { pattern: 'up', width: 1600, maxWidth: '672px', size: 'lg' },
  { pattern: 'down', width: 420, maxWidth: '384px', size: 'cover' },
  { pattern: 'down', width: 500, maxWidth: '384px', size: 'xs' },
  { pattern: 'down', width: 800, maxWidth: '448px', size: 'sm' },
  { pattern: 'down', width: 1100, maxWidth: '672px', size: 'lg' },
  { pattern: 'down', width: 1300, maxWidth: '896px', size: 'xl' },
  { pattern: 'down', width: 1600, maxWidth: '512px', size: 'md' },
] as const;

/** Check rendered width and geometry at a breakpoint of the authored contract. */
async function checkCase(page: Page, selection: (typeof cases)[number]): Promise<void> {
  const content = page.getByTestId('dialog-responsive-content');
  const positioner = page.getByTestId('dialog-responsive-positioner');
  await page.setViewportSize({ width: selection.width, height: 700 });
  await expect(content).toHaveCSS('max-width', selection.maxWidth);
  const coverPadding =
    selection.size === 'cover' || (selection.pattern === 'up' && selection.width >= 500);
  await expect(positioner).toHaveCSS('padding', coverPadding ? '40px' : '0px');
  await expect(content).toHaveAttribute('data-leverui-dialog-css', '');
  await expect(content).toHaveClass(/\bleverui-dialog__content\b/);
}

/** Verify upward, array, and downward finite choices through media queries. */
async function verifiesResponsiveCss({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  await page.goto('/iframe.html?id=internal-dialog-responsive-css-contract--contract');
  const selection = page.getByTestId('dialog-responsive-selection');
  const content = page.getByTestId('dialog-responsive-content');

  for (const pattern of ['up', 'array', 'down'] as const) {
    await selection.selectOption(pattern);
    await page.getByTestId('dialog-responsive-open').click();
    await expect(content).toBeVisible();
    const expected = pattern === 'array' ? 'up' : pattern;
    for (const responsiveCase of cases.filter(
      /** Use the same visible width contract for array and upward object forms. */
      (candidate) => candidate.pattern === expected,
    )) {
      await checkCase(page, responsiveCase);
    }
    await page.keyboard.press('Escape');
    await expect(content).toHaveCount(0);
  }
}

/** Keep live responsive attributes updated on a mounted Dialog machine. */
async function verifiesReactiveMixedRanges({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-dialog-responsive-css-contract--contract');
  await page.getByTestId('dialog-responsive-open').click();
  const content = page.getByTestId('dialog-responsive-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-size-md', 'xs');

  await page.getByTestId('dialog-responsive-selection').evaluate(
    /** Dispatch native input even while the modal makes background controls inert. */
    (element) => {
      if (!(element instanceof HTMLSelectElement)) throw new Error('Missing pattern control.');
      element.value = 'mixed';
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
  );
  await expect(content).toHaveAttribute('data-size-md', 'lg');
  await expect(content).toHaveAttribute('data-size-md-down', 'full');
  await expect(content).toHaveAttribute('data-size-xl-down', 'xs');
  await page.setViewportSize({ width: 800, height: 700 });
  await expect(content).toHaveCSS('max-width', '384px');
  await page.setViewportSize({ width: 1600, height: 700 });
  await expect(content).toHaveCSS('max-width', '448px');
}

test('Dialog responsive CSS applies finite media choices', verifiesResponsiveCss);
test('Dialog responsive CSS updates on a mounted root', verifiesReactiveMixedRanges);
