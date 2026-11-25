import { expect, test, type Page } from '@playwright/test';
import { enableBrowserClipboard } from '../browser/clipboard-test-setup';

const storyIds = ['basic', 'button', 'timeout', 'input', 'link'] as const;
const exampleUrl = 'https://leverui.com';

/** Require each Clipboard example to render its machine root. */
async function verifiesEveryClipboardExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(360_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-clipboard--${id}`);
    await expect(
      page.locator('[data-clipboard-root]').first(),
      `Clipboard example ${id} should render`,
    ).toBeVisible({ timeout: 60_000 });
  }
}

/** Copy the renamed example URL through the compact icon trigger. */
async function verifiesIconCopy({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--basic');
  const trigger = page.getByRole('button', { name: 'Copy to clipboard' });
  await trigger.click();
  expect(
    await page.evaluate(
      /** Read the value written by the example's trigger. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe(exampleUrl);
}

/** Show copied feedback and reset it after the configured timeout. */
async function verifiesButtonTimeout({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--timeout');
  const button = page.locator('[data-clipboard-trigger]');
  await expect(button).toContainText('Copy');
  await button.click();
  await expect(button).toContainText('Copied');
  await expect(button).toContainText('Copy', { timeout: 5_000 });
}

/** Keep the copied value visible in the input composition. */
async function verifiesInputCopy({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--input');
  await expect(page.getByRole('textbox', { name: 'Document link', exact: true })).toHaveValue(
    exampleUrl,
  );
  await page.getByRole('button', { name: 'Copy to clipboard' }).click();
  expect(
    await page.evaluate(
      /** Read the value copied from the document-link input. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe(exampleUrl);
}

/** Preserve the link-like trigger's keyboard copy behavior. */
async function verifiesLinkCopy({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--link');
  const trigger = page.locator('[data-clipboard-trigger]');
  await expect(trigger).toContainText(exampleUrl);
  await trigger.focus();
  await page.keyboard.press('Enter');
  expect(
    await page.evaluate(
      /** Read the value copied by the keyboard trigger. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe(exampleUrl);
}

test('all Clipboard examples render', verifiesEveryClipboardExample);
test('icon Clipboard copies the example URL', verifiesIconCopy);
test('Clipboard button resets its copy status', verifiesButtonTimeout);
test('Clipboard input shows and copies the URL', verifiesInputCopy);
test('Clipboard link trigger copies from the keyboard', verifiesLinkCopy);
