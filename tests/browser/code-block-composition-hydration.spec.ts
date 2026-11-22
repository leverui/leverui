import { enableBrowserClipboard } from './clipboard-test-setup';
import { readFile } from 'node:fs/promises';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { expect, test, type Page } from '@playwright/test';
import {
  renderSyncedCodeTabs,
  type CodeTabsComponents,
} from '../../.storybook/code-block-composition-tabs-tree';

type ServerComponents = CodeTabsComponents;
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render the real tabbed composition through the published server entry. */
function renderPublishedTabs(): JSX.Element {
  return renderSyncedCodeTabs(server, 'hydrated');
}

/** Attach browser controls to the server's visible default tabbed sample. */
async function hydrateCodeTabsInBrowser(): Promise<void> {
  const modulePath = '/.storybook/code-block-composition-hydration-example.ts';
  const { hydrateCodeTabsExample } = await import(modulePath);
  const root = document.getElementById('code-tabs-hydration-root');
  if (!root) throw new Error('Tabbed Code Block hydration root was not found.');
  hydrateCodeTabsExample(root);
}

/** Verify default SSR content, preserved nodes, and saved selection on hydration. */
async function verifiesTabbedCodeBlockHydration({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  const markup = renderToString(renderPublishedTabs);
  expect(markup).toContain('const ready = true');
  expect(markup).toContain('aria-selected="true"');
  expect(markup).toContain('hydrated-code-block');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await expect(page.getByTestId('hydration-host')).toBeVisible({ timeout: 15_000 });
  await page.evaluate(
    /** Preload a consumer selection without changing the published markup. */
    () => localStorage.setItem('leverui-code-block-language', 'python'),
  );
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="code-tabs-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#code-tabs-hydration-root');
  const root = page.getByTestId('hydrated-code-block');
  const copy = page.getByTestId('hydrated-copy');
  await expect(page.getByTestId('hydrated-typescript-panel')).toBeVisible();
  await expect(page.getByTestId('hydrated-python-panel').locator('code')).toHaveCount(0);
  await expect(copy).toHaveAccessibleName('Copy hydrated code');
  await root.evaluate(
    /** Distinguish the original server root from a replacement. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await copy.evaluate(
    /** Distinguish the server-rendered copy trigger from a replacement. */
    (element) => element.setAttribute('data-server-copy', 'true'),
  );
  const errors: string[] = [];

  /** Record hydration errors rather than suppressing them. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateCodeTabsInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(page.getByTestId('hydrated-python-panel')).toBeVisible();
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(copy).toHaveAttribute('data-server-copy', 'true');
  await expect(copy).toHaveAccessibleName('Copy hydrated code');
  await expect(page.getByTestId('hydrated-typescript-panel').locator('code')).toHaveCount(0);
  await expect(page.locator('#hydrated-python-code')).toHaveText('ready = True\nprint(ready)');
  await copy.click();
  await expect(copy).toHaveAccessibleName('Copy hydrated code');
  await expect(copy).toHaveAttribute('data-server-copy', 'true');
  expect(
    await page.evaluate(
      /** Read source copied through the hydrated published browser component. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('ready = True\nprint(ready)');
  expect(errors).toEqual([]);
}

test(
  'published tabbed Code Block hydrates and restores selection',
  verifiesTabbedCodeBlockHydration,
);
