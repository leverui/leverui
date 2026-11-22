import { expect, test, type Page } from '@playwright/test';

/** Read the viewport's native vertical position after a pointer action. */
async function readTop(page: Page): Promise<number> {
  return page.getByTestId('scroll-viewport').evaluate(
    /** Report the browser's actual scroll position. */
    (element) => element.scrollTop,
  );
}

/** Verify both Zag's draggable thumb and clickable track remain connected. */
async function verifiesPointerScrolling({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--basic');
  await page.getByTestId('scroll-viewport').hover();
  const scrollbar = page.getByTestId('scrollbar');
  const thumb = scrollbar.locator('[data-scroll-area-thumb]');
  await expect(scrollbar).toHaveCSS('opacity', '1');
  const thumbBox = await thumb.boundingBox();
  const trackBox = await scrollbar.boundingBox();
  expect(thumbBox).not.toBeNull();
  expect(trackBox).not.toBeNull();
  if (!thumbBox || !trackBox) return;

  const centerX = thumbBox.x + thumbBox.width / 2;
  const centerY = thumbBox.y + thumbBox.height / 2;
  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX, centerY + 60, { steps: 8 });
  await page.mouse.up();
  await expect
    .poll(
      /** Wait for thumb dragging to move the viewport. */
      () => readTop(page),
    )
    .toBeGreaterThan(0);

  await page.getByTestId('scroll-viewport').evaluate(
    /** Return to the start before testing a click on the empty track. */
    (element) => {
      element.scrollTop = 0;
    },
  );
  await expect
    .poll(
      /** Wait for the viewport to return to its upper edge. */
      () => readTop(page),
    )
    .toBe(0);
  await page.mouse.click(centerX, trackBox.y + trackBox.height - 8);
  await expect
    .poll(
      /** Wait for a track click to move the viewport. */
      () => readTop(page),
    )
    .toBeGreaterThan(0);
}

test('ScrollArea thumb drag and track click scroll natively', verifiesPointerScrolling);
