import { enableBrowserClipboard } from './clipboard-test-setup';
import { expect, test, type Page } from '@playwright/test';

/** Verify native parts, metadata, highlighting, and plain-text fallback. */
async function verifiesCodeBlockParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-code-block--matrix');
  const root = page.getByTestId('code-block-root');
  const code = page.getByTestId('code-block-code');
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveClass(/(?:^|\s)leverui-code-block__root(?:\s|$)/);
  await expect(root).toHaveAttribute('data-has-line-numbers', '');
  await expect(root).toHaveAttribute('data-has-focused', '');
  await expect(root).toHaveAttribute('data-has-diff', '');
  await expect(root).toHaveAttribute('data-leverui-color-mode', 'dark');
  expect(
    await root.evaluate(
      /** Read a consumer stylesheet override of the public highlight token. */
      (element) =>
        getComputedStyle(element).getPropertyValue('--lui-code-block-highlight-bg').trim(),
    ),
  ).toBe('rgb(10 20 30)');
  await expect(page.getByTestId('code-block-header')).toHaveJSProperty('tagName', 'HEADER');
  await expect(page.getByTestId('code-block-title')).toHaveText('example.ts');
  await expect(page.getByTestId('code-block-control')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('code-block-footer')).toHaveJSProperty('tagName', 'DIV');
  await expect(page.getByTestId('code-block-pre')).toHaveJSProperty('tagName', 'PRE');
  await expect(page.getByTestId('code-block-pre')).toHaveAttribute('tabindex', '0');
  await expect(code).toHaveJSProperty('tagName', 'CODE');
  await expect(code).toHaveAttribute('data-has-line-numbers', '');
  await expect(code).toHaveAttribute('data-word-wrap', '');
  await expect(code).not.toHaveAttribute('data-plaintext');
  await expect(code.locator('[data-line]')).toHaveCount(3);
  await expect(code.locator('[data-line="2"]')).toHaveAttribute('data-highlight', '');
  await expect(code.locator('[data-line="2"]')).toHaveAttribute('data-diff', 'added');
  await expect(code.locator('[data-line="3"]')).toHaveAttribute('data-diff', 'removed');
  await expect(code.locator('[data-line="1"]')).toHaveAttribute('data-focused', '');
  await expect(page.getByTestId('code-block-plain')).toHaveAttribute('data-plaintext', '');
  await expect(page.getByTestId('code-block-plain')).toHaveText(
    'const ready = true\nconsole.log(ready)\nreturn ready',
  );
  await expect(page.getByTestId('code-block-light')).toHaveAttribute('data-plaintext', '');
  await expect(page.getByTestId('code-block-light')).toHaveCSS('padding-left', '20px');
}

test('Code Block preserves native parts and source metadata', verifiesCodeBlockParts);

/** Verify native disclosure, overlay, clipboard, and copied status. */
async function verifiesCodeBlockControls({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=content-code-block--matrix');
  const content = page.getByTestId('code-block-content');
  const collapse = page.getByTestId('code-block-collapse');
  const overlay = page.getByTestId('code-block-overlay');
  await expect(content).toHaveAttribute('aria-expanded', 'false');
  await expect(collapse).toHaveAttribute('aria-expanded', 'false');
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Code Block content is missing its disclosure ID.');
  await expect(collapse).toHaveAttribute('aria-controls', contentId);
  await expect(collapse).toHaveAttribute('aria-label', 'Expand code block');
  await expect(overlay).toHaveCSS('display', 'flex');
  await collapse.click();
  await expect(content).toHaveAttribute('aria-expanded', 'true');
  await expect(collapse).toHaveAttribute('aria-label', 'Collapse code block');
  await expect(overlay).toHaveCSS('display', 'none');
  await collapse.click();
  await expect(content).toHaveAttribute('aria-expanded', 'false');

  const copy = page.getByTestId('code-block-copy');
  await copy.click();
  await expect(copy).toHaveText('Copied');
  await expect(page.getByTestId('code-block-copy-count')).toHaveText('1');
  const clipboard = await page.evaluate(
    /** Read actual browser clipboard contents after the Zag copy event. */
    () => navigator.clipboard.readText(),
  );
  expect(clipboard).toBe('const ready = true\nconsole.log(ready)\nreturn ready');
  await expect(copy).toHaveText('Copy');
}

test('Code Block copies source and expands with native controls', verifiesCodeBlockControls);

/** Verify live source and size changes preserve the code element. */
async function verifiesReactiveCodeBlock({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-code-block--matrix');
  const code = page.getByTestId('code-block-code');
  const root = page.getByTestId('code-block-root');
  await expect(root).toHaveCSS('border-radius', '6px');
  await expect(code).toHaveCSS('padding-left', '16px');
  await code.evaluate(
    /** Mark the original native code node before source changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('code-block-source-toggle').click();
  await expect(code).toHaveAttribute('data-original-node', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(4);
  await expect(page.getByTestId('code-block-context')).toContainText('// finished');
  await page.getByTestId('code-block-size-toggle').click();
  await expect(root).toHaveCSS('border-radius', '12px');
  await expect(code).toHaveCSS('padding-left', '20px');
  await expect(code).toHaveAttribute('data-original-node', 'true');
}

test('Code Block updates source and size without remounting', verifiesReactiveCodeBlock);

/** Verify responsive finite size reaches every slot without remounting parts. */
async function verifiesResponsiveCodeBlock({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-code-block--matrix');
  const root = page.getByTestId('code-block-responsive-root');
  const header = page.getByTestId('code-block-responsive-header');
  const title = page.getByTestId('code-block-responsive-title');
  const pre = page.getByTestId('code-block-responsive-pre');
  const code = page.getByTestId('code-block-responsive-code');
  await expect(root).toHaveCSS('border-radius', '6px');
  await expect(header).toHaveCSS('min-height', '32px');
  await expect(title).toHaveCSS('font-size', '12px');
  await expect(pre).toHaveCSS('font-size', '12px');
  await expect(code).toHaveCSS('padding-left', '16px');
  await code.evaluate(
    /** Mark the mounted code node before the breakpoint changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );

  await page.setViewportSize({ width: 900, height: 720 });
  await expect(root).toHaveCSS('border-radius', '12px');
  await expect(header).toHaveCSS('min-height', '48px');
  await expect(title).toHaveCSS('font-size', '14px');
  await expect(pre).toHaveCSS('font-size', '14px');
  await expect(code).toHaveCSS('padding-left', '20px');
  await expect(code).toHaveAttribute('data-original-node', 'true');
  await expect(root).not.toHaveAttribute('size');
}

test('Code Block follows responsive size across its slots', verifiesResponsiveCodeBlock);
