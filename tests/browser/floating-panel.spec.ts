import { expect, test, type Page } from '@playwright/test';

/** Verify lazy mounting, native parts, stage controls, and focus return. */
async function verifiesPanelContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-floating-panel--contract');
  const trigger = page.getByTestId('floating-trigger');
  const content = page.getByTestId('floating-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await expect(trigger).not.toHaveAttribute('aria-controls');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('floating-open')).toHaveText('true');
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveClass(/leverui-floating-panel__content/);
  await expect(content).toHaveCSS('display', 'flex');
  await expect(page.getByRole('heading', { name: 'Floating panel' })).toBeVisible();
  await expect(page.getByTestId('floating-resize')).toHaveCount(3);
  await expect(page.locator('[data-placement="s"]')).toHaveCount(1);
  await expect(page.locator('[data-placement="e"]')).toHaveCount(1);
  await expect(page.locator('[data-placement="se"]')).toHaveCount(1);
  await page.getByTestId('floating-minimize').click();
  await expect(content).toHaveAttribute('data-minimized', '');
  await page.getByTestId('floating-restore').click();
  await expect(content).not.toHaveAttribute('data-minimized');
  await page.getByTestId('floating-maximize').click();
  await expect(content).toHaveAttribute('data-maximized', '');
  await page.getByTestId('floating-restore').click();
  await expect(content).not.toHaveAttribute('data-maximized');
  await page.getByTestId('floating-close').click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('floating-open')).toHaveText('false');
  await expect(trigger).toBeFocused();
}

test('Floating Panel composes the primitive behavior with Lever UI slots', verifiesPanelContract);

/** Verify pointer drag and southeast resize update the primitive's live geometry. */
async function verifiesPanelGeometry({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-floating-panel--contract');
  await page.getByTestId('floating-trigger').click();
  const position = page.getByTestId('floating-position');
  const size = page.getByTestId('floating-size');
  const beforePosition = await position.textContent();
  const drag = await page.getByTestId('floating-drag').boundingBox();
  if (!drag) throw new Error('The Floating Panel drag handle is missing.');
  const dragX = drag.x + drag.width / 2;
  const dragY = drag.y + drag.height / 2;
  await page.mouse.move(dragX, dragY);
  await page.mouse.down();
  await page.mouse.move(dragX + 48, dragY + 32, { steps: 5 });
  await page.mouse.up();
  await expect(position).not.toHaveText(beforePosition ?? '');

  const beforeSize = await size.textContent();
  const resize = await page.locator('[data-placement="se"]').boundingBox();
  if (!resize) throw new Error('The southeast resize handle is missing.');
  const resizeX = resize.x + resize.width / 2;
  const resizeY = resize.y + resize.height / 2;
  await page.mouse.move(resizeX, resizeY);
  await page.mouse.down();
  await page.mouse.move(resizeX + 50, resizeY + 35, { steps: 5 });
  await page.mouse.up();
  await expect(size).not.toHaveText(beforeSize ?? '');
}

test('Floating Panel moves and resizes through the primitive', verifiesPanelGeometry);
