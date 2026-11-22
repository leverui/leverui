import { expect, test, type Page } from '@playwright/test';

/** Verify quotation semantics, selected elements, and consumer CSS priority. */
async function verifiesQuoteContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-quote--contract');
  const native = page.getByTestId('native-quote');
  await expect(native).toBeVisible({ timeout: 15_000 });
  await expect(native).toHaveJSProperty('tagName', 'Q');
  await expect(native).toHaveAttribute('cite', 'https://example.com/quotation');
  await expect(native).toHaveAttribute('title', 'Source quotation');
  await expect(native).toHaveAttribute('data-ref-tag', 'q');
  await expect(native).toHaveCSS('font-weight', '700');
  const ratio = await native.evaluate(
    /** Read the rendered line-height relative to the browser font size. */
    (element) => {
      const style = getComputedStyle(element);
      return Number.parseFloat(style.lineHeight) / Number.parseFloat(style.fontSize);
    },
  );
  expect(ratio).toBeCloseTo(1.2, 2);
  await expect(page.getByTestId('unstyled-quote')).toHaveCSS('font-weight', '400');
  await page.addStyleTag({ content: '.consumer-quote{font-weight:400;line-height:2}' });
  await expect(page.getByTestId('css-quote')).toHaveCSS('font-weight', '400');

  const anchor = page.getByTestId('link-quote');
  await expect(anchor).toHaveJSProperty('tagName', 'A');
  await expect(anchor).toHaveAttribute('href', '#quote-target');
  await expect(anchor).toHaveAttribute('data-ref-tag', 'a');
  await anchor.focus();
  await expect(anchor).toBeFocused();
  await anchor.click();
  await expect(page.getByTestId('quote-clicks')).toHaveText('1');
  await expect(page.getByTestId('child-quote')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('child-quote')).toHaveCSS('font-weight', '700');
}

test('Quote preserves native quotation and style overrides', verifiesQuoteContract);

/** Verify reactive consumer classes and tag props without replacing a native node. */
async function verifiesReactiveQuote({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-quote--contract');
  const reactive = page.getByTestId('reactive-quote');
  await expect(reactive).toHaveCSS('color', 'rgb(239, 68, 68)');
  await reactive.evaluate(
    /** Mark the original native node before updating its consumer class. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('quote-style-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('font-weight', '400');
  await expect(reactive).toHaveCSS('color', 'rgb(59, 130, 246)');

  const selected = page.getByTestId('tag-quote');
  await expect(selected).toHaveJSProperty('tagName', 'Q');
  await page.getByTestId('quote-tag-toggle').click();
  await expect(selected).toHaveJSProperty('tagName', 'SPAN');
  await expect(selected).toHaveAttribute('data-ref-tag', 'span');
  await expect(selected).toHaveCSS('font-weight', '700');
  await page.getByTestId('quote-tag-toggle').click();
  await expect(selected).toHaveJSProperty('tagName', 'Q');
}

test('Quote follows Solid class and native tag changes', verifiesReactiveQuote);
