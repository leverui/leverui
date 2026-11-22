import { expect, test, type Page } from '@playwright/test';

/** Verify accessible parts, default presence, sizing, and focus movement. */
async function verifiesPopoverContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--contract');
  const trigger = page.getByTestId('popover-trigger');
  const content = page.getByTestId('popover-content');
  const title = page.getByTestId('popover-title');
  const description = page.getByTestId('popover-description');
  const input = page.getByTestId('popover-input');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toBeHidden();
  await expect(content).toHaveAttribute('data-state', 'closed');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(page.getByTestId('popover-open')).toHaveText('true');
  await expect(input).toBeFocused();
  await expect(content).toHaveClass(/popover__content/);
  await expect(page.getByTestId('popover-body')).toHaveCSS('padding', '20px');
  await expect(page.getByTestId('popover-header')).toHaveJSProperty('tagName', 'HEADER');
  await expect(page.getByTestId('popover-footer')).toHaveJSProperty('tagName', 'FOOTER');
  await expect(page.getByTestId('popover-arrow').locator('[data-popover-arrow-tip]')).toHaveCount(
    1,
  );
  const titleId = await title.getAttribute('id');
  const descriptionId = await description.getAttribute('id');
  if (!titleId || !descriptionId) throw new Error('Popover accessible names have no IDs.');
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveAttribute('aria-describedby', descriptionId);
  await page.getByTestId('popover-close').click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
}

test('Popover composes accessible primitive parts with Lever UI styling', verifiesPopoverContract);

/** Verify Escape and outside clicks dismiss without taking outside focus. */
async function verifiesPopoverDismissal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--contract');
  const trigger = page.getByTestId('popover-trigger');
  const content = page.getByTestId('popover-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(content).toBeVisible();
  const outside = page.getByTestId('popover-outside');
  await outside.click();
  await expect(content).toBeHidden();
}

test('Popover dismisses on Escape and outside interaction', verifiesPopoverDismissal);

/** Verify a custom anchor, placement, and mobile size constraints. */
async function verifiesPopoverPlacement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--positioned');
  const anchor = page.getByTestId('popover-anchor');
  const trigger = page.getByTestId('popover-placed-trigger');
  const content = page.getByTestId('popover-placed-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-placement', 'right-start');
  await expect(page.getByTestId('popover-placed-body')).toHaveCSS('padding', '12px');
  await expect
    .poll(
      /** Wait until the primitive applies the selected placement to the actual layout. */
      async () => {
        const anchorBounds = await anchor.boundingBox();
        const contentBounds = await content.boundingBox();
        if (!anchorBounds || !contentBounds) return Number.NEGATIVE_INFINITY;
        return contentBounds.x - (anchorBounds.x + anchorBounds.width);
      },
    )
    .toBeGreaterThanOrEqual(-1);
  await page.setViewportSize({ width: 375, height: 700 });
  await expect(content).toBeVisible();
  await expect
    .poll(
      /** Wait for the responsive width to settle after the viewport change. */
      async () => (await content.boundingBox())?.width ?? Number.POSITIVE_INFINITY,
    )
    .toBeLessThanOrEqual(375 - 16);
}

test('Popover honors an anchor, placement, and responsive width', verifiesPopoverPlacement);

/** Keep a stable anchor hook while forwarding caller CSS and attributes. */
async function verifiesUnstyledAnchorSlot({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--anchor-css');
  const anchor = page.getByTestId('popover-css-anchor');
  await expect(anchor).toBeVisible({ timeout: 30_000 });
  await expect(anchor).toHaveAttribute('title', 'Custom anchor');
  await expect(anchor).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(anchor).toHaveCSS('color', 'rgb(1, 2, 3)');
  await expect(anchor).toHaveClass(/popover__anchor/);
}

test('Popover Anchor exposes a stable hook and honors caller CSS', verifiesUnstyledAnchorSlot);
