import { expect, test, type Page } from '@playwright/test';

/** Check every scalar Drawer size and placement on one machine instance. */
async function verifiesDrawerVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer-variants--contract');
  const content = page.getByTestId('drawer-variant-content');
  const positioner = page.getByTestId('drawer-variant-positioner');
  const size = page.getByRole('combobox', { name: 'Drawer size' });
  const placement = page.getByRole('combobox', { name: 'Drawer placement' });
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveAttribute('data-size', 'xs');
  await expect(positioner).toHaveAttribute('data-placement', 'end');
  await page.addStyleTag({
    content: '.lui-drawer__content { --lui-drawer-background: rgb(240, 248, 255); }',
  });
  await expect(content).toHaveCSS('background-color', 'rgb(240, 248, 255)');
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Drawer variant content has no machine ID.');
  const widthCases = [
    ['xs', '320px'],
    ['sm', '448px'],
    ['md', '512px'],
    ['lg', '672px'],
    ['xl', '896px'],
    ['full', '1280px'],
  ] as const;
  for (const [variant, width] of widthCases) {
    await size.selectOption(variant);
    await expect(content).toHaveAttribute('data-size', variant);
    await expect(content).toHaveCSS('max-width', width);
    await expect(content).toHaveAttribute('id', id);
  }
  await expect(content).toHaveCSS('height', '720px');
  await size.selectOption('xs');
  const placementCases = [
    ['start', 'flex-start', 'slide-from-left-full, fade-in'],
    ['end', 'flex-end', 'slide-from-right-full, fade-in'],
    ['top', 'flex-start', 'slide-from-top-full, fade-in'],
    ['bottom', 'flex-end', 'slide-from-bottom-full, fade-in'],
  ] as const;
  for (const [variant, alignment, animation] of placementCases) {
    await placement.selectOption(variant);
    await expect(content).toHaveAttribute('data-placement', variant);
    await expect(positioner).toHaveAttribute('data-placement', variant);
    const property = variant === 'top' || variant === 'bottom' ? 'align-items' : 'justify-content';
    await expect(positioner).toHaveCSS(property, alignment);
    await expect(content).toHaveCSS('animation-name', animation);
  }
  await page.getByRole('checkbox', { name: 'Contained' }).check();
  await expect(content).toHaveAttribute('data-contained', 'true');
  await expect(positioner).toHaveCSS('padding', '16px');
  await expect(content).toHaveAttribute('id', id);
  await page.getByRole('checkbox', { name: 'Unstyled' }).check();
  await expect(content).not.toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveAttribute('data-unstyled', '');
  await expect(content).toHaveAttribute('id', id);
  await page.getByRole('checkbox', { name: 'Unstyled' }).uncheck();
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveAttribute('id', id);
}

test(
  'Drawer size, placement, motion, and contained variants stay reactive',
  verifiesDrawerVariants,
);

/** Verify CSS breakpoint variants without remounting the Drawer machine. */
async function verifiesResponsiveDrawer({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 700, height: 700 });
  await page.goto('/iframe.html?id=components-drawer-variants--responsive');
  const content = page.getByTestId('drawer-responsive-content');
  const positioner = page.getByTestId('drawer-responsive-positioner');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveAttribute('data-size-md-down', 'full');
  await expect(content).toHaveAttribute('data-size-md', 'lg');
  await expect(content).toHaveAttribute('data-placement-md-down', 'bottom');
  await expect(positioner).toHaveAttribute('data-placement-md', 'end');
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Responsive Drawer content has no machine ID.');
  await expect(content).toHaveCSS('max-width', '100%');
  await expect(content).toHaveCSS('width', '700px');
  await expect(content).toHaveCSS('height', '700px');
  await expect(positioner).toHaveCSS('align-items', 'flex-end');
  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(positioner).toHaveCSS('justify-content', 'flex-end');
  await expect(content).toHaveAttribute('id', id);
}

test('Drawer responds at both sides of the medium breakpoint', verifiesResponsiveDrawer);
