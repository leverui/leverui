import { expect, test, type Page } from '@playwright/test';

/** Read one computed pseudo-element property from a highlighted line. */
async function pseudoStyle(
  page: Page,
  selector: string,
  pseudo: '::before' | '::after',
  property: string,
): Promise<string> {
  return page.locator(selector).evaluate(
    /** Resolve the rendered pseudo-element, including its theme variables. */
    (element, options) =>
      getComputedStyle(element, options.pseudo).getPropertyValue(options.property),
    { pseudo, property },
  );
}

/** Verify mapped sizes, scopes, and line presentation in Chromium. */
async function verifiesCodeBlockVisuals({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-code-block--matrix');
  const main = page.getByTestId('code-block-root');
  const light = page.getByTestId('code-block-light-root');
  const fallback = page.getByTestId('code-block-default-root');
  const plain = page.getByTestId('code-block-plain-root');
  const content = page.getByTestId('code-block-content');
  const code = page.getByTestId('code-block-code');

  await expect(main).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(main).toHaveCSS('color', 'rgb(250, 250, 250)');
  await expect(main).toHaveCSS('border-radius', '6px');
  await expect(page.getByTestId('code-block-title')).toHaveCSS('line-height', '16px');
  await expect(plain).toHaveCSS('border-radius', '8px');
  await expect(fallback).toHaveCSS('border-radius', '8px');
  await expect(light).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(light).toHaveCSS('color', 'rgb(9, 9, 11)');
  await expect(light).toHaveCSS('border-radius', '12px');
  await expect(content).toHaveCSS('max-height', '320px');
  await expect(code).toHaveCSS('padding-left', '16px');

  const first = '[data-testid="code-block-code"] [data-line="1"]';
  const second = '[data-testid="code-block-code"] [data-line="2"]';
  const third = '[data-testid="code-block-code"] [data-line="3"]';
  await expect(page.locator(first)).toHaveCSS('opacity', '1');
  await expect(page.locator(second)).toHaveCSS('opacity', '0.5');
  await expect(page.locator(second)).toHaveCSS('filter', 'blur(1px)');
  expect((await pseudoStyle(page, first, '::before', 'content')).trim()).toBe('counter(line)');
  expect((await pseudoStyle(page, second, '::before', 'content')).trim()).toBe('"+"');
  expect((await pseudoStyle(page, third, '::before', 'content')).trim()).toBe('"-"');
  expect((await pseudoStyle(page, second, '::before', 'opacity')).trim()).toBe('0.4');
  expect((await pseudoStyle(page, second, '::after', 'border-left-width')).trim()).toBe('2px');
  expect((await pseudoStyle(page, second, '::after', 'border-left-color')).trim()).toBe(
    'rgb(34, 197, 94)',
  );
  expect((await pseudoStyle(page, third, '::after', 'border-left-color')).trim()).toBe(
    'rgb(239, 68, 68)',
  );
  await expect(page.getByTestId('code-block-overlay')).toHaveCSS('display', 'flex');
  await page.getByTestId('code-block-collapse').click();
  await expect(content).toHaveCSS('max-height', 'none');
  await expect(page.getByTestId('code-block-overlay')).toHaveCSS('display', 'none');
  await page.getByTestId('code-block-size-toggle').click();
  await expect(page.getByTestId('code-block-title')).toHaveCSS('line-height', '20px');
}

test('Code Block CSS preserves mapped visual states', verifiesCodeBlockVisuals);
