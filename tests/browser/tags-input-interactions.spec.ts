import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Read the native value submitted by the reset story's form. */
async function readResetFormValue(page: Page): Promise<FormDataEntryValue | null> {
  return page.getByTestId('tags-reset-form').evaluate(
    /** Read the browser's own serialized form field. */
    (form) => new FormData(form as HTMLFormElement).get('frameworks'),
  );
}

/** Restore both visible tags and native form data to the initial value. */
async function verifiesFormReset({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-interactions--reset');
  const input = page.getByPlaceholder('Add reset tag');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await input.fill('React');
  await input.press('Enter');
  await expect(page.locator('.leverui-tags-input__itemText')).toHaveText(['Solid', 'React']);
  expect(await readResetFormValue(page)).toContain('React');
  await page.getByRole('button', { name: 'Reset tags' }).click();
  await expect(page.locator('.leverui-tags-input__itemText')).toHaveText(['Solid']);
  expect(await readResetFormValue(page)).toBe('Solid');
}

test('native form reset restores the initial visible and submitted tags', verifiesFormReset);

/** Keep equal strings distinct through indexed deletion and inline editing. */
async function verifiesDuplicatesAndEditing({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-interactions--duplicates');
  const items = page.locator('.leverui-tags-input__item');
  await expect(items).toHaveCount(2, { timeout: 30_000 });
  await items.nth(1).getByRole('button', { name: 'Delete tag Echo' }).click();
  await expect(items).toHaveCount(1);
  await expect(items.first().locator('.leverui-tags-input__itemText')).toHaveText('Echo');
  await items.first().locator('.leverui-tags-input__itemPreview').dblclick();
  const editor = items.first().locator('.leverui-tags-input__itemInput');
  await expect(editor).toBeVisible();
  await page.evaluate(
    /** Let the machine's queued editor focus action finish before typing. */
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(editor).toBeFocused();
  await editor.fill('Updated');
  await editor.press('Enter');
  await expect(items.first().locator('.leverui-tags-input__itemText')).toHaveText('Updated');
  const input = page.getByPlaceholder('Add duplicate tag');
  await input.focus();
  await input.press('ArrowLeft');
  await expect(items.first().locator('.leverui-tags-input__itemPreview')).toHaveAttribute(
    'data-highlighted',
    '',
  );
  await input.press('Backspace');
  await expect(items).toHaveCount(0);
}

test(
  'duplicate tags retain index identity and support keyboard editing',
  verifiesDuplicatesAndEditing,
);

/** Exercise validation, normalization, custom delimiter, blur, and maximum. */
async function verifiesDocumentedOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-interactions--options');
  const input = page.getByPlaceholder('Add limited tag');
  const values = page.locator('.leverui-tags-input__itemText');
  const machineState = page.getByTestId('options-machine-state');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await input.fill('ab');
  await input.press('Enter');
  await expect(values).toHaveCount(0);
  await expect(machineState).toContainText('"inputValue":""');
  await expect(input).toHaveValue('');
  await input.pressSequentially('SOLID');
  await expect(input).toHaveValue('SOLID');
  await expect(machineState).toContainText('"inputValue":"SOLID"');
  await input.press(';');
  await expect(values).toHaveText(['solid']);
  await expect(input).toHaveValue('');
  await input.fill('React');
  await expect(input).toHaveValue('React');
  await expect(machineState).toContainText('"inputValue":"React"');
  await pressBrowserTab(page);
  const nextField = page.getByRole('button', { name: 'Next field' });
  await expect(nextField).toBeFocused();
  await expect(values).toHaveText(['solid', 'react']);
  await input.fill('Vue');
  await input.press('Enter');
  await expect(values).toHaveCount(2);
}

test('Tags Input honors validation, sanitize, delimiter, blur, and max', verifiesDocumentedOptions);

/** Split one native paste input event into multiple tags. */
async function verifiesPaste({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-interactions--paste');
  const input = page.getByPlaceholder('Paste tags');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await input.fill('React,Solid,TypeScript');
  await input.evaluate(
    /** Dispatch the browser input event produced by a multi-value paste. */
    (element) => {
      const field = element as HTMLInputElement;
      field.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
    },
  );
  await expect(page.locator('.leverui-tags-input__itemText')).toHaveText([
    'React',
    'Solid',
    'TypeScript',
  ]);
}

test('Tags Input splits pasted values at its custom delimiter', verifiesPaste);

/** Update inherited behavior and appearance without replacing the root. */
async function verifiesReactiveProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-interactions--provider');
  const root = page.getByTestId('tags-provider-root');
  const control = page.getByTestId('tags-provider-control');
  const item = root.locator('.leverui-tags-input__item');
  await expect(control).toHaveCSS('min-height', '36px', { timeout: 30_000 });
  await root.evaluate(
    /** Identify the first root DOM node before provider defaults change. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await item.locator('.leverui-tags-input__itemPreview').dblclick();
  await expect(item.locator('.leverui-tags-input__itemInput')).toBeHidden();
  await page.getByRole('button', { name: 'Enable editing' }).click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(control).toHaveCSS('min-height', '44px');
  await item.locator('.leverui-tags-input__itemPreview').dblclick();
  await expect(item.locator('.leverui-tags-input__itemInput')).toBeVisible();
}

test(
  'reactive PropsProvider updates machine behavior and recipe in place',
  verifiesReactiveProvider,
);
