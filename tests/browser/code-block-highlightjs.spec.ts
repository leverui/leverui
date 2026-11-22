import { expect, test, type Page } from '@playwright/test';

/** Verify the actual optional engine, its CSS, and reactive source changes. */
async function verifiesHighlightJsConsumer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-code-block-highlight-js--ready');
  const pre = page.getByTestId('highlight-js-pre');
  const code = page.getByTestId('highlight-js-code');
  await expect(pre).toHaveJSProperty('tagName', 'PRE');
  await expect(code).toHaveJSProperty('tagName', 'CODE');
  await expect(code).toHaveText('const ready = true\nconsole.log(ready)');
  await expect(code).not.toHaveAttribute('data-plaintext', { timeout: 30_000 });
  await expect(code.locator('[data-line]')).toHaveCount(2);
  await expect(code.locator('[data-line="2"]')).toHaveAttribute('data-highlight', '');
  await expect(code.locator('[data-line="2"]')).toHaveAttribute('data-diff', 'added');
  await expect(code.locator('.hljs-keyword')).toHaveCSS('color', 'rgb(255, 123, 114)');
  await code.evaluate(
    /** Tag the native code node before updating the language. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );

  await page.locator('#highlight-js-language').selectOption('html');
  await expect(page.getByTestId('highlight-js-title')).toHaveText('example.html');
  await expect(code).toHaveText('<strong>Ready</strong>\n<p>Visible</p>');
  await expect(code).toHaveAttribute('data-original-node', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  await expect(code.locator('.hljs-name').first()).toHaveCSS('color', 'rgb(126, 231, 135)');
  await expect(code.locator('strong')).toHaveCount(0);
}

test(
  'Code Block uses a real Highlight.js adapter across language changes',
  verifiesHighlightJsConsumer,
);
