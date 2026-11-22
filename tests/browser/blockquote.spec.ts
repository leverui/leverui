import { expect, test, type Page } from '@playwright/test';

/** Verify semantic parts, authored treatments, and all alignments. */
async function verifiesBlockquoteMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote--matrix');
  const subtle = page.getByTestId('blockquote-subtle');
  await expect(subtle).toHaveJSProperty('tagName', 'FIGURE');
  await expect(subtle.locator('blockquote')).toHaveAttribute('cite', 'https://example.com');
  await expect(subtle.locator('figcaption cite')).toHaveText('Writer');
  await expect(subtle).toHaveCSS('border-left-width', '4px');
  await expect(page.getByTestId('blockquote-solid')).toHaveCSS('border-left-width', '4px');
  await expect(page.getByTestId('blockquote-plain')).toHaveCSS('border-left-width', '0px');
  await expect(page.getByTestId('blockquote-subtle-icon')).toHaveCSS('width', '20px');
  await expect(page.getByTestId('blockquote-start')).toHaveCSS('align-items', 'flex-start');
  await expect(page.getByTestId('blockquote-center')).toHaveCSS('align-items', 'center');
  await expect(page.getByTestId('blockquote-end')).toHaveCSS('align-items', 'flex-end');
  await expect(page.getByTestId('blockquote-unstyled')).toHaveCSS('display', 'block');
}

test('Blockquote parts and variants render in Chromium', verifiesBlockquoteMatrix);

/** Verify inherited alignment changes on the same DOM node. */
async function verifiesReactiveBlockquote({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote--matrix');
  const reactive = page.getByTestId('blockquote-reactive');
  const fixed = page.getByTestId('blockquote-fixed');
  await expect(reactive).toHaveCSS('align-items', 'flex-start');
  await expect(fixed).toHaveCSS('align-items', 'flex-end');
  await reactive.evaluate(
    /** Mark the existing native figure before changing provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('blockquote-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('align-items', 'center');
  await expect(fixed).toHaveCSS('align-items', 'flex-end');
  await expect(reactive).not.toHaveAttribute('justify');
  await expect(reactive).not.toHaveAttribute('variant');
}

test('Blockquote provider updates the mounted figure', verifiesReactiveBlockquote);
