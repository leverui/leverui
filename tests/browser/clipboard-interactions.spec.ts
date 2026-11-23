import { enableBrowserClipboard } from './clipboard-test-setup';
import { expect, test, type Page } from '@playwright/test';

/** Load the caller-owned specimen with the browser's clipboard test setup. */
async function openInteractiveClipboard(page: Page): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard-interactions--child-renderers');
  await expect(page.getByTestId('clipboard-child-root')).toBeVisible({ timeout: 30_000 });
}

/** Preserve native label focus, selection, and copy status through asChild. */
async function verifiesNativeInputCopy({ page }: { page: Page }): Promise<void> {
  await openInteractiveClipboard(page);
  const root = page.getByTestId('clipboard-child-root');
  const label = page.getByTestId('clipboard-child-label');
  const input = page.getByTestId('clipboard-child-input');
  const trigger = page.getByTestId('clipboard-child-trigger');
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(root).toHaveAttribute('data-root-ref', 'attached');
  await expect(trigger).toHaveJSProperty('tagName', 'BUTTON');
  await expect(trigger).toHaveAttribute('data-trigger-ref', 'attached');
  await expect(trigger).toHaveAttribute('type', 'button');
  await expect(trigger).toHaveAttribute('aria-label', 'Copy project link');
  await expect(input).toHaveValue('https://leverui.com/docs');
  await expect(input).toHaveAttribute('id', /.+/);
  expect(await label.getAttribute('for')).toBe(await input.getAttribute('id'));
  await label.click();
  await expect(input).toBeFocused();
  const selection = await input.evaluate(
    /** Read the native input selection after Zag's focus handler runs. */
    (element) => {
      if (!(element instanceof HTMLInputElement)) throw new Error('Clipboard input is not native.');
      return { start: element.selectionStart, end: element.selectionEnd };
    },
  );
  expect(selection).toEqual({ start: 0, end: 'https://leverui.com/docs'.length });
  await input.evaluate(
    /** Record the text the browser's native copy takes from the input's selection. */
    (element) => {
      const field = element as HTMLInputElement;
      // Capture at the window, before the input's own handlers re-render it.
      window.addEventListener(
        'copy',
        () => {
          field.dataset.copiedText = field.value.slice(
            field.selectionStart ?? 0,
            field.selectionEnd ?? 0,
          );
        },
        { capture: true, once: true },
      );
    },
  );
  await page.keyboard.press('ControlOrMeta+C');
  await expect(page.getByTestId('clipboard-status')).toHaveText('copied');
  await expect(trigger).toHaveAttribute('aria-label', 'Copied project link');
  await expect(trigger.getByText('Done')).toBeVisible();
  await expect(page.getByTestId('clipboard-null-copy-text')).toBeEmpty();
  await expect(page.getByTestId('clipboard-custom-copy-text')).toHaveText('Saved');
  // Zag 2 leaves input copying to the browser's native copy instead of the
  // Clipboard API, so check the text that copy carried.
  await expect(input).toHaveAttribute('data-copied-text', 'https://leverui.com/docs');
  await expect(trigger).toHaveAttribute('aria-label', 'Copy project link', { timeout: 5_000 });
}

test('Clipboard child input selects and copies through its native label', verifiesNativeInputCopy);

/** Keep the caller-owned link button operable with Space and pointer input. */
async function verifiesLinkTrigger({ page }: { page: Page }): Promise<void> {
  await openInteractiveClipboard(page);
  const trigger = page.getByTestId('clipboard-child-trigger');
  await expect(trigger).toHaveClass(/lui-link/);
  await expect(trigger.getByText('Ready')).toBeVisible();
  await expect(trigger).toContainText('https://leverui.com/docs');
  await trigger.focus();
  await page.keyboard.press('Space');
  await expect(trigger.getByText('Done')).toBeVisible();
  await expect(page.getByTestId('clipboard-null-copy-text')).toBeEmpty();
  await expect(page.getByTestId('clipboard-custom-copy-text')).toHaveText('Saved');
  expect(
    await page.evaluate(
      /** Read the clipboard after Space activates the native button. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('https://leverui.com/docs');
  await expect(trigger.getByText('Ready')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByTestId('clipboard-null-copy-text')).toHaveText('Copy');
  await trigger.click();
  await expect(trigger.getByText('Done')).toBeVisible();
  await expect(trigger).toHaveAttribute('data-trigger-ref', 'attached');
}

test('Clipboard link trigger copies with keyboard and click', verifiesLinkTrigger);
