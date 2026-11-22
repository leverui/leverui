import { expect, test, type Page } from '@playwright/test';

/** Verify inline markup, native selection, and consumer styling. */
async function verifiesSpanContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-span--contract');
  const line = page.getByTestId('span-inline-line');
  const native = page.getByTestId('span-default');
  await expect(native).toBeVisible({ timeout: 15_000 });
  await expect(native).toHaveJSProperty('tagName', 'SPAN');
  await expect(native).toHaveClass(/leverui-span/);
  await expect(native).toHaveCSS('display', 'inline');
  await expect(native).toHaveAttribute('title', 'Inline segment');
  await expect(native).toHaveAttribute('data-ref-tag', 'span');
  await expect(native).not.toHaveAttribute('role');
  await expect(line).toContainText('Before inline after');

  await expect(page.getByTestId('span-styled')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('span-styled')).toHaveCSS('color', 'rgb(239, 68, 68)');
  await page.addStyleTag({ content: '.consumer-span{color:rgb(1, 2, 3)}' });
  await expect(page.getByTestId('span-consumer-css')).toHaveCSS('color', 'rgb(1, 2, 3)');

  const selected = page.getByTestId('span-selected');
  await expect(selected).toHaveJSProperty('tagName', 'A');
  await expect(selected).toHaveAttribute('href', '#span-target');
  await expect(selected).toHaveAttribute('data-ref-tag', 'a');
  await expect(selected).toHaveClass(/leverui-span/);
  await selected.click();
  await expect(page.getByTestId('span-clicks')).toHaveText('1');
  await expect(page.getByTestId('span-child')).toHaveAttribute('href', '#span-child-target');
  await expect(page.getByTestId('span-child')).toHaveClass(/leverui-span/);
}

test('Span preserves inline semantics and consumer styling', verifiesSpanContract);

/** Verify a tracked consumer class updates without replacing its native span. */
async function verifiesReactiveSpan({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-span--contract');
  const reactive = page.getByTestId('span-reactive');
  await expect(reactive).toHaveCSS('color', 'rgb(239, 68, 68)');
  await reactive.evaluate(
    /** Mark the original span before updating its CSS class. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('span-color-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('color', 'rgb(59, 130, 246)');
}

test('Span updates consumer classes on the same native element', verifiesReactiveSpan);
