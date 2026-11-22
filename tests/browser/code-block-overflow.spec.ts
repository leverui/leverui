import { expect, test, type Page } from '@playwright/test';

/** Measure whether the native pre element has content outside its viewport. */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.getByTestId('overflow-pre').evaluate(
    /** Compare the scrollable width with the visible code viewport. */
    (element) => element.scrollWidth - element.clientWidth,
  );
}

/** Verify actual scrolling, wrapped lines, and stable native code elements. */
async function verifiesOverflowAndWrap({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-code-block-overflow--ready');
  const pre = page.getByTestId('overflow-pre');
  const code = page.getByTestId('overflow-code');
  await expect(pre).toHaveJSProperty('tagName', 'PRE');
  await expect(code).not.toHaveAttribute('data-plaintext', { timeout: 30_000 });
  await expect(code.locator('[data-line]')).toHaveCount(2);
  await expect(code).toHaveAttribute('data-has-line-numbers', '');
  await expect(code).not.toHaveAttribute('data-word-wrap');
  expect(await horizontalOverflow(page)).toBeGreaterThan(100);
  await pre.focus();
  if (page.context().browser()?.browserType().name() === 'webkit') {
    await pre.hover();
    await page.mouse.wheel(120, 0);
  } else {
    await page.keyboard.press('ArrowRight');
  }
  await expect
    .poll(
      /** Confirm the focused code viewport responds to native horizontal scrolling. */
      () =>
        pre.evaluate(
          /** Read the pre element's horizontal scroll position. */
          (element) => element.scrollLeft,
        ),
    )
    .toBeGreaterThan(0);
  await pre.evaluate(
    /** Move to the end of the long line through native horizontal scrolling. */
    (element) => {
      element.scrollLeft = element.scrollWidth;
    },
  );
  await expect
    .poll(
      /** Wait for the browser to apply the requested scroll position. */
      () =>
        pre.evaluate(
          /** Read the native scroll position after moving to the line end. */
          (element) => element.scrollLeft,
        ),
    )
    .toBeGreaterThan(0);
  const rightGap = await pre.evaluate(
    /** Measure visible space after the longest source line at the scroll end. */
    (element) => {
      const firstLine = element.querySelector('[data-line="1"]');
      if (!firstLine) throw new Error('The first highlighted source line is missing.');
      const range = document.createRange();
      range.selectNodeContents(firstLine);
      return element.getBoundingClientRect().right - range.getBoundingClientRect().right;
    },
  );
  expect(rightGap).toBeGreaterThan(8);
  await code.evaluate(
    /** Tag the original native code element before changing wrap metadata. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );

  await page.getByTestId('overflow-toggle').click();
  await expect(code).toHaveAttribute('data-word-wrap', '');
  await expect(code).toHaveAttribute('data-original-node', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  await expect(code.locator('[data-line="1"]')).toHaveCSS('white-space', 'pre-wrap');
  await expect
    .poll(
      /** Wait until the long token wraps within the fixed-width surface. */
      () => horizontalOverflow(page),
    )
    .toBeLessThanOrEqual(1);
  const firstLineHeight = await code.locator('[data-line="1"]').evaluate(
    /** Compare one source line's visual height with its CSS line height. */
    (element) => element.getBoundingClientRect().height,
  );
  const lineHeight = await code.evaluate(
    /** Read the native line height used by the highlighted code. */
    (element) => Number.parseFloat(getComputedStyle(element).lineHeight),
  );
  expect(firstLineHeight).toBeGreaterThan(lineHeight * 2);
}

test('Code Block scrolls long source and wraps numbered lines reactively', verifiesOverflowAndWrap);
