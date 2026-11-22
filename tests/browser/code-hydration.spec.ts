import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderCodeHydrationTree,
  type CodeHydrationComponents,
} from '../../.storybook/code-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CodeHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach Code's browser behavior to the server-rendered element. */
async function hydrateCodeInBrowser(): Promise<void> {
  const modulePath = '/.storybook/code-hydration-example.tsx';
  const { hydrateCodeExample } = await import(modulePath);
  const root = document.getElementById('code-hydration-root');
  if (!root) throw new Error('Code hydration root was not found.');
  hydrateCodeExample(root);
}

/** Verify published Code hydration preserves its node, CSS, and reactivity. */
async function verifiesCodeHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree with the published server entry. */
    () => renderCodeHydrationTree(server),
  );
  expect(markup).toContain('data-size="xs"');
  expect(markup).toContain('data-variant="solid"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="code-hydration-root">${markup}</div>`,
  );
  const code = page.locator('#hydrated-code');
  await expect(code).toHaveJSProperty('tagName', 'CODE');
  await expect(code).toHaveText('npm run build');
  await expect(code).toHaveCSS('min-height', '16px');
  await code.evaluate(
    /** Mark the native server element before hydration attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser errors during hydration and the size update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateCodeInBrowser);
  await expect(page.locator('#code-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(code).toHaveAttribute('data-server-node', 'true');
  await page.locator('#code-hydration-toggle').click();
  await expect(code).toHaveAttribute('data-size', 'lg');
  await expect(code).toHaveCSS('min-height', '28px');
  expect(errors).toEqual([]);
}

test('published Code hydrates without replacing its native element', verifiesCodeHydration);
