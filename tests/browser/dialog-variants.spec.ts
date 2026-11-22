import { expect, test, type Page } from '@playwright/test';

/** Verify recipe and role changes preserve one mounted Dialog machine. */
async function verifiesDialogVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog-variants--contract');
  const content = page.getByTestId('dialog-variant-content');
  const positioner = page.getByTestId('dialog-variant-positioner');
  const body = page.getByTestId('dialog-variant-body');
  const viewportHeight = page.viewportSize()?.height;
  if (!viewportHeight) throw new Error('Dialog variants need a fixed browser viewport.');
  await expect(content).toBeVisible({ timeout: 30_000 });
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Dialog content has no machine ID.');
  await expect(content).toHaveCSS('max-width', '512px');
  await body.getByRole('button', { name: 'Cover' }).click();
  await expect(content).toHaveCSS('height', `${viewportHeight - 80}px`);
  await body.getByRole('button', { name: 'Full' }).click();
  await expect(content).toHaveCSS('min-height', `${viewportHeight}px`);
  await body.getByRole('button', { name: 'Medium' }).click();
  await expect(content).toHaveCSS('max-width', '512px');
  await body.getByRole('button', { name: 'Bottom' }).click();
  await expect(positioner).toHaveCSS('align-items', 'flex-end');
  await body.getByRole('button', { name: 'Center' }).click();
  await expect(positioner).toHaveCSS('align-items', 'center');
  await body.getByRole('button', { name: 'Inside' }).click();
  await expect(body).toHaveCSS('overflow', 'auto');
  await body.getByRole('button', { name: 'Outside' }).click();
  await expect(positioner).toHaveCSS('overflow', 'auto');
  const motion = body.getByRole('combobox', { name: 'Motion preset' });
  const motionCases = [
    ['none', 'none'],
    ['slide-in-bottom', 'slide-from-bottom, fade-in'],
    ['slide-in-top', 'slide-from-top, fade-in'],
    ['slide-in-left', 'slide-from-left, fade-in'],
    ['slide-in-right', 'slide-from-right, fade-in'],
    ['scale', 'scale-in, fade-in'],
  ] as const;
  for (const [preset, animation] of motionCases) {
    await motion.selectOption(preset);
    await expect(content).toHaveCSS('animation-name', animation);
  }
  await body.getByRole('button', { name: 'Alert role' }).click();
  await expect(content).toHaveAttribute('role', 'alertdialog');
  await expect(content).toHaveAttribute('id', id);
}

test('Dialog variants and alert role remain reactive', verifiesDialogVariants);

/** Verify responsive Dialog size changes with viewport conditions. */
async function verifiesResponsiveSize({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 700, height: 700 });
  await page.goto('/iframe.html?id=components-dialog-variants--responsive');
  const content = page.getByTestId('dialog-responsive-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Responsive Dialog is missing a content ID.');
  await expect(content).toHaveAttribute('data-size-md-down', 'full');
  await expect(content).toHaveAttribute('data-size-md', 'lg');
  await expect(content).toHaveAttribute('data-leverui-dialog-css', '');
  await expect(content).toHaveCSS('max-width', '700px');
  await expect(content).toHaveCSS('min-height', '700px');
  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(content).toHaveAttribute('id', contentId);
}

test(
  'Dialog applies responsive size at both sides of the medium breakpoint',
  verifiesResponsiveSize,
);
