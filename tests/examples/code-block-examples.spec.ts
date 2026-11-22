import { expect, test, type Page } from '@playwright/test';
import { enableBrowserClipboard } from '../browser/clipboard-test-setup';

const storyIds = [
  'basic',
  'copy-button',
  'custom-action',
  'line-focusing',
  'line-highlighting',
  'title',
  'line-numbers',
  'diff',
  'max-lines',
  'word-wrap',
  'line-numbers-word-wrap',
  'language-switcher',
  'sizes',
  'floating-copy-button',
  'themes',
  'plain-text',
  'horizontal-overflow',
  'overflow-and-overlay',
  'highlight-js',
  'tabs',
  'tabs-sync',
] as const;

/** Require each implemented CodeBlock story to render code. */
async function verifiesCodeBlockStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-codeblock--${id}`);
    await expect(page.locator('#storybook-root pre code').first()).toHaveText(/\S/, {
      timeout: 45_000,
    });
  }
}

/** Expand and collapse the long code block. */
async function verifiesMaxLines({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-codeblock--max-lines');
  const content = page.locator('.leverui-code-block__content');
  const expand = page.getByRole('button', { name: 'Expand code block' }).first();
  await expect(expand).toBeVisible();
  await expand.click();
  await expect(content).toHaveAttribute('data-expanded', '');
}

/** Keep the renamed install command available for copying. */
async function verifiesPlainText({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-codeblock--plain-text');
  await expect(page.locator('#storybook-root pre code')).toContainText(
    'npm install @leverui/components',
  );
  await page.getByRole('button', { name: 'Copy to clipboard' }).click();
  expect(
    await page.evaluate(
      /** Read the copied install command. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('npm install @leverui/components');
}

/** Replace the Python sample with the TypeScript source. */
async function verifiesLanguageSwitcher({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-codeblock--language-switcher');
  await expect(page.locator('#storybook-root pre code')).toContainText('from github import Github');
  await page.getByRole('combobox', { name: 'Code language' }).click();
  await page.getByRole('option', { name: /typescript/ }).click();
  await expect(page.locator('#storybook-root pre code')).toContainText('import { Octokit }');
}

/** Follow the Storybook color-mode toolbar in syntax and page styling. */
async function verifiesThemeSwitcher({ page }: { page: Page }): Promise<void> {
  test.setTimeout(90_000);
  await page.goto('/?path=/story/components-codeblock--themes');
  const preview = page.frameLocator('#storybook-preview-iframe');
  const code = preview.locator('#storybook-root pre code');
  await expect(code).toContainText('<h1>Hello, world!</h1>', { timeout: 45_000 });
  await expect(preview.locator('html')).toHaveAttribute('data-leverui-color-mode', 'light');
  const lightMarkup = await code.innerHTML();
  await page.getByRole('button', { name: 'Gallery color mode Light' }).click();
  await page.getByRole('option', { name: 'Dark' }).click();
  await expect(preview.locator('html')).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(code).not.toHaveJSProperty('innerHTML', lightMarkup);
}

/** Switch the active source inside the tabbed code block. */
async function verifiesCodeTabs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-codeblock--tabs');
  await page.getByRole('tab', { name: 'TypeScript' }).click();
  await expect(page.locator('#storybook-root pre code')).toContainText(
    "console.log('Hello, World!')",
  );
}

/** Synchronize package-manager tabs and retain their selection on reload. */
async function verifiesSyncedTabs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-codeblock--tabs-sync');
  await page.getByRole('tab', { name: 'yarn' }).first().click();
  await expect(page.locator('#storybook-root pre code')).toHaveCount(2);
  await expect(page.locator('#storybook-root pre code').first()).toContainText(
    'yarn add @leverui/components',
  );
  await expect(page.locator('#storybook-root pre code').last()).toContainText(
    'yarn add @leverui/components',
  );
  await page.reload();
  await expect(page.locator('#storybook-root pre code').first()).toContainText(
    'yarn add @leverui/components',
  );
}

/** Copy the source through the icon action. */
async function verifiesCodeCopy({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-codeblock--copy-button');
  await page.getByRole('button', { name: 'Copy to clipboard' }).click();
  expect(
    await page.evaluate(
      /** Read the content written by CodeBlock's copy machine. */
      () => navigator.clipboard.readText(),
    ),
  ).toContain('<h1>Hello, world!</h1>');
}

/** Keep the complete terminal transcript in the wrapped line-number example. */
async function verifiesWrappedTerminalOutput({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-codeblock--line-numbers-word-wrap');
  const code = page.locator('#storybook-root pre code');
  await expect(code).toContainText('.v8flags.9.4.146.26-node');
  await expect(code).toContainText('.vmware');
  await expect(code).toContainText('.jupyter');
}

/** Announce the custom action without navigating away. */
async function verifiesCustomAction({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-codeblock--custom-action');
  page.once(
    'dialog',
    /** Verify and dismiss the example alert. */
    async (dialog) => {
      expect(dialog.message()).toBe('Open in sandbox');
      await dialog.dismiss();
    },
  );
  await page.getByRole('button', { name: 'Open in sandbox' }).click();
}

test('all twenty-one CodeBlock examples render', verifiesCodeBlockStories);
test('CodeBlock copy action copies the source', verifiesCodeCopy);
test('wrapped terminal output includes the complete sample', verifiesWrappedTerminalOutput);
test('CodeBlock custom action announces the sandbox', verifiesCustomAction);
test('CodeBlock expands beyond ten lines', verifiesMaxLines);
test('plain text CodeBlock copies the install command', verifiesPlainText);
test('CodeBlock language switcher changes the source', verifiesLanguageSwitcher);
test('CodeBlock syntax follows the gallery color mode', verifiesThemeSwitcher);
test('CodeBlock tabs change the active language', verifiesCodeTabs);
test('CodeBlock package-manager tabs stay synchronized', verifiesSyncedTabs);
