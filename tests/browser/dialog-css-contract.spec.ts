import { expect, test, type Page } from '@playwright/test';

const sizeWidths = {
  xs: '384px',
  sm: '448px',
  md: '512px',
  lg: '672px',
  xl: '896px',
  cover: 'none',
  full: '1280px',
} as const;
const alignments = { center: 'center', top: 'flex-start', bottom: 'flex-end' } as const;
const motionNames = {
  scale: 'scale-in, fade-in',
  'slide-in-bottom': 'slide-from-bottom, fade-in',
  'slide-in-top': 'slide-from-top, fade-in',
  'slide-in-left': 'slide-from-left, fade-in',
  'slide-in-right': 'slide-from-right, fade-in',
  none: 'none',
} as const;

/** Open the selected case and check the portal's authored CSS attributes. */
async function openDialog(page: Page): Promise<void> {
  await page.getByTestId('dialog-css-open').click();
  const content = page.getByTestId('dialog-css-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveAttribute('data-lui-dialog-css', '');
  await expect(content).toHaveClass(/\blui-dialog__content\b/);
  // Zag 2 starts its dismissable layer, which handles Escape, as it moves initial focus.
  await expect(content.getByRole('button', { name: 'Close' })).toBeFocused();
}

/** Dismiss through the primitive and leave the next finite case with a fresh portal. */
async function closeDialog(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('dialog-css-content')).toHaveCount(0);
}

/** Verify finite choices through native attributes and resolved authored CSS. */
async function verifiesFiniteAppearance({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto('/iframe.html?id=internal-dialog-css-contract--contract');
  const content = page.getByTestId('dialog-css-content');
  const positioner = page.getByTestId('dialog-css-positioner');

  for (const [size, width] of Object.entries(sizeWidths)) {
    await page.getByTestId('dialog-css-size').selectOption(size);
    await openDialog(page);
    await expect(content).toHaveAttribute('data-size', size);
    await expect(content).toHaveCSS('max-width', width);
    await expect(positioner).toHaveCSS('padding', size === 'cover' ? '40px' : '0px');
    await closeDialog(page);
  }

  for (const [placement, alignment] of Object.entries(alignments)) {
    await page.getByTestId('dialog-css-placement').selectOption(placement);
    await openDialog(page);
    await expect(positioner).toHaveAttribute('data-placement', placement);
    await expect(positioner).toHaveCSS('align-items', alignment);
    await closeDialog(page);
  }

  for (const scroll of ['inside', 'outside'] as const) {
    await page.getByTestId('dialog-css-scroll').selectOption(scroll);
    await openDialog(page);
    await expect(positioner).toHaveAttribute('data-scroll-behavior', scroll);
    await expect(positioner).toHaveCSS('overflow', scroll === 'inside' ? 'hidden' : 'auto');
    await expect(page.getByTestId('dialog-css-body')).toHaveCSS(
      'overflow',
      scroll === 'inside' ? 'auto' : 'visible',
    );
    await closeDialog(page);
  }

  for (const [motion, animation] of Object.entries(motionNames)) {
    await page.getByTestId('dialog-css-motion').selectOption(motion);
    await openDialog(page);
    await expect(content).toHaveAttribute('data-motion-preset', motion);
    await expect(content).toHaveCSS('animation-name', animation);
    await closeDialog(page);
  }
}

/** Preserve native overrides while unstyled suppresses authored presentation. */
async function verifiesUnstyledAndNativeProps({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-dialog-css-contract--contract');
  await page.getByTestId('dialog-css-unstyled').check();
  await page.getByTestId('dialog-css-open').click();
  const content = page.getByTestId('dialog-css-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-unstyled', '');
  await expect(content).not.toHaveAttribute('data-lui-dialog-css');
  await expect(content).toHaveClass(/\bconsumer-dialog\b/);
  await expect(content).toHaveCSS('border-color', 'rgb(40, 50, 60)');
  await expect(content).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await content.getByRole('button', { name: 'Close' }).click();
  await expect(content).toHaveCount(0);
}

test(
  'Dialog finite appearance uses authored CSS and primitive dismissal',
  verifiesFiniteAppearance,
);
test('Dialog unstyled preserves native class and style', verifiesUnstyledAndNativeProps);
