import { expect, test, type Page } from '@playwright/test';

/** Verify native horizontal movement and logical scrollbar placement in RTL. */
async function verifiesRtlDirections({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--rtl');
  const root = page.getByTestId('rtl-root');
  const viewport = page.getByTestId('rtl-viewport');
  const vertical = page.getByTestId('rtl-scrollbar');
  const horizontal = page.getByTestId('rtl-horizontal-scrollbar');
  await expect(root).toHaveAttribute('dir', 'rtl');
  await expect(viewport).toHaveCSS('direction', 'rtl');
  await expect(viewport).toHaveAttribute('data-overflow-x', '');
  await expect(viewport).toHaveAttribute('data-overflow-y', '');
  await expect(horizontal).toHaveAttribute('data-orientation', 'horizontal');

  const rootBox = await root.boundingBox();
  const verticalBox = await vertical.boundingBox();
  expect(rootBox).not.toBeNull();
  expect(verticalBox).not.toBeNull();
  if (!rootBox || !verticalBox) return;
  expect(verticalBox.x).toBeGreaterThanOrEqual(rootBox.x);
  expect(verticalBox.x - rootBox.x).toBeLessThan(8);

  await viewport.hover();
  await page.mouse.wheel(-180, 0);
  await expect
    .poll(
      /** In Chromium, moving left from the RTL start yields a negative offset. */
      () =>
        viewport.evaluate(
          /** Read Chromium's native RTL horizontal offset. */
          (element) => element.scrollLeft,
        ),
    )
    .toBeLessThan(0);
}

test('ScrollArea supports RTL in both scroll directions', verifiesRtlDirections);
