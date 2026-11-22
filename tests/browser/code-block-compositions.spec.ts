import { enableBrowserClipboard } from './clipboard-test-setup';
import { expect, test, type Page } from '@playwright/test';

const story = '/iframe.html?id=content-code-block-compositions--ready';

/** Keep a selected source, floating copy control, and theme on one native node. */
async function verifiesLanguageSwitcher({ page }: { page: Page }): Promise<void> {
  test.setTimeout(60_000);
  await enableBrowserClipboard(page);
  await page.goto(story);
  const root = page.getByTestId('switcher-root');
  const code = page.getByTestId('switcher-code');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(code).toHaveText('const ready = true\nconsole.log(ready)');
  await expect(code).toHaveAttribute('data-word-wrap', '');
  await expect(code).not.toHaveAttribute('data-plaintext', { timeout: 30_000 });
  await expect(code.locator('span.line')).toHaveCount(2);
  await expect(code.locator('span.line').first()).toHaveCSS('white-space', 'pre-wrap');
  await expect(page.getByTestId('floating-copy')).toHaveCSS('position', 'absolute');
  await code.evaluate(
    /** Mark the original code element before changing the selected language. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );

  await page.locator('#code-block-language').selectOption('python');
  await expect(page.getByTestId('switcher-title')).toHaveText('example.py');
  await expect(code).toHaveText('ready = True\nprint(ready)');
  await expect(code).not.toHaveAttribute('data-plaintext');
  await expect(code).toHaveAttribute('data-original-node', 'true');
  const darkMarkup = await code.innerHTML();
  await page.getByTestId('switcher-copy').click();
  expect(
    await page.evaluate(
      /** Read the source copied by the floating Zag clipboard trigger. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('ready = True\nprint(ready)');
  await page.getByTestId('code-block-theme-toggle').click();
  await expect(root).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(code).toHaveAttribute('data-original-node', 'true');
  await expect
    .poll(
      /** Wait for Shiki to apply the selected light theme. */
      () => code.innerHTML(),
    )
    .not.toBe(darkMarkup);
}

test('Code Block composes with a language switcher and floating copy', verifiesLanguageSwitcher);

/** Keep two Tabs compositions aligned and restore their selected language. */
async function verifiesLinkedTabs({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto(story);
  await expect(page.getByTestId('first-typescript-panel')).toBeVisible();
  await expect(page.getByTestId('second-typescript-panel')).toBeVisible();
  await expect(page.getByTestId('first-python-panel').locator('code')).toHaveCount(0);
  await expect(page.getByTestId('second-python-panel').locator('code')).toHaveCount(0);
  const firstRoot = page.getByTestId('first-code-block');
  await firstRoot.evaluate(
    /** Mark the mounted root before switching its source. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('first-python-tab').click();
  await expect(page.getByTestId('first-python-panel')).toBeVisible();
  await expect(page.getByTestId('second-python-panel')).toBeVisible();
  await expect(page.getByTestId('first-typescript-panel')).toBeHidden();
  await expect(page.getByTestId('first-typescript-panel').locator('code')).toHaveCount(0);
  await expect(page.getByTestId('second-typescript-panel').locator('code')).toHaveCount(0);
  await expect(firstRoot).toHaveAttribute('data-original-node', 'true');
  await expect(page.locator('#first-python-code')).toHaveText('ready = True\nprint(ready)');
  await page.getByTestId('first-copy').click();
  expect(
    await page.evaluate(
      /** Read the source copied from the selected tab. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('ready = True\nprint(ready)');
  expect(
    await page.evaluate(
      /** Read the application-owned persistence key after tab selection. */
      () => localStorage.getItem('leverui-code-block-language'),
    ),
  ).toBe('python');
  await page.reload();
  await expect(page.getByTestId('first-python-panel')).toBeVisible();
  await expect(page.getByTestId('second-python-panel')).toBeVisible();
}

test('Code Block composes with synchronized persistent Tabs', verifiesLinkedTabs);

/** Synchronize separate documents through the browser's storage event. */
async function verifiesCrossTabSync({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  const other = await page.context().newPage();
  await other.goto(story);
  await expect(other.getByTestId('first-typescript-panel')).toBeVisible();
  await page.getByTestId('first-python-tab').click();
  await expect(other.getByTestId('first-python-panel')).toBeVisible();
  await expect(other.getByTestId('second-python-panel')).toBeVisible();
  await other.getByTestId('second-typescript-tab').click();
  await expect(page.getByTestId('first-typescript-panel')).toBeVisible();
  await expect(page.getByTestId('second-typescript-panel')).toBeVisible();
}

test('Code Block tab groups synchronize across browser tabs', verifiesCrossTabSync);
