import { enableBrowserClipboard } from './clipboard-test-setup';
import { expect, test, type Page } from '@playwright/test';

/** Verify composed native buttons retain the primitive and disclosure semantics. */
async function verifiesComposedControls({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=content-code-block-interactions--ready');
  const content = page.getByTestId('interaction-content');
  const collapse = page.getByTestId('composed-collapse');
  const copy = page.getByTestId('composed-copy');
  await expect(collapse).toHaveJSProperty('tagName', 'BUTTON');
  await expect(collapse).toHaveClass(/consumer-collapse/);
  await expect(collapse).toHaveAttribute('data-parent', 'collapse');
  await expect(collapse).toHaveAccessibleName('Toggle code sample');
  await expect(collapse).toHaveText('Expand code');
  await expect(copy).toHaveClass(/consumer-copy/);
  await expect(copy).toHaveAttribute('data-parent', 'copy');
  await expect(copy).toHaveAccessibleName('Copy to clipboard');
  await expect(copy.locator('svg rect')).toHaveAttribute('width', '14');
  await expect(content).toHaveAttribute('id', 'interaction-content-id');
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Composed Code Block content has no ID.');
  await expect(collapse).toHaveAttribute('aria-controls', contentId);
  await expect(content).toHaveAttribute('aria-expanded', 'false');

  await collapse.focus();
  await page.keyboard.press('Enter');
  await expect(content).toHaveAttribute('aria-expanded', 'true');
  await expect(collapse).toHaveAccessibleName('Toggle code sample');
  await expect(collapse).toHaveText('Collapse code');
  await page.keyboard.press('Space');
  await expect(content).toHaveAttribute('aria-expanded', 'false');
  await expect(collapse).toHaveText('Expand code');

  await page.getByTestId('toggle-cancellation').click();
  await collapse.click();
  await expect(content).toHaveAttribute('aria-expanded', 'false');
  await page.getByTestId('toggle-cancellation').click();

  await copy.evaluate(
    /** Mark the original composed button before its indicator changes. */
    (element) => element.setAttribute('data-original-copy', 'true'),
  );
  await copy.focus();
  await expect(copy).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('copy-count')).toHaveText('1');
  await expect(copy).toHaveAccessibleName('Copied to clipboard');
  await expect(copy).toHaveAttribute('data-original-copy', 'true');
  await expect(copy).toBeFocused();
  await expect(copy.locator('svg path')).toHaveAttribute('d', 'M20 6 9 17l-5-5');
  expect(
    await page.evaluate(
      /** Read the copied source after a native keyboard activation. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('alpha\nbeta');

  await page.getByTestId('toggle-disabled').click();
  await expect(collapse).toBeDisabled();
  await expect(copy).toBeDisabled();
  await collapse.evaluate(
    /** Verify native disabled buttons ignore programmatic clicks. */
    (element) => (element as HTMLButtonElement).click(),
  );
  await copy.evaluate(
    /** Verify the primitive's copy handler is not invoked on a disabled button. */
    (element) => (element as HTMLButtonElement).click(),
  );
  await expect(content).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('copy-count')).toHaveText('1');
}

test(
  'composed Code Block controls support keyboard and disabled behavior',
  verifiesComposedControls,
);
