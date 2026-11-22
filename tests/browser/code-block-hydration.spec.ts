import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderCodeBlockHydrationTree,
  type CodeBlockHydrationComponents,
} from '../../.storybook/code-block-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CodeBlockHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the shared Code Block tree from Storybook's client module. */
async function hydrateCodeBlockInBrowser(): Promise<void> {
  const modulePath = '/.storybook/code-block-hydration-example.tsx';
  const { hydrateCodeBlockExample } = await import(modulePath);
  const root = document.getElementById('code-block-hydration-root');
  if (!root) throw new Error('Code Block hydration root was not found.');
  hydrateCodeBlockExample(root);
}

/** Verify published Code Block markup hydrates without replacing native parts. */
async function verifiesCodeBlockHydration({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderCodeBlockHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>#hydrated-custom-code-block { --leverui-code-block-radius: 23px; }</style><div id="code-block-hydration-root">${markup}</div>`,
  );
  const code = page.locator('#hydrated-code-block-code');
  const content = page.locator('#hydrated-code-block-content');
  const collapse = page.locator('#hydrated-code-block-collapse');
  const inheritedRoot = page.locator('#hydrated-code-block');
  const customRoot = page.locator('#hydrated-custom-code-block');
  const customCode = page.locator('#hydrated-custom-code-block-code');
  await expect(inheritedRoot).toHaveJSProperty('tagName', 'SECTION');
  await expect(inheritedRoot).toHaveAttribute('title', 'Hydrated shared code');
  await expect(code).toHaveJSProperty('tagName', 'CODE');
  await expect(code).toHaveText('one');
  await expect(inheritedRoot).toHaveCSS('border-radius', '6px');
  await expect(code).toHaveCSS('padding-left', '16px');
  await expect(content).toHaveAttribute('aria-expanded', 'true');
  await expect(collapse).toHaveAccessibleName('Toggle hydrated code');
  await expect(collapse).toHaveAttribute('aria-controls', 'hydrated-code-block-content');
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await expect(customRoot).toHaveCSS('border-radius', '23px');
  await expect(customRoot).toHaveCSS('border-top-width', '4px');
  await expect(customRoot.locator('pre')).toHaveCSS('font-size', '19px');
  await expect(customCode).toHaveText('const custom = true');
  await code.evaluate(
    /** Mark the original server code element before attaching Solid. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await collapse.evaluate(
    /** Mark the server-rendered labelled control before hydration. */
    (element) => element.setAttribute('data-server-collapse', 'true'),
  );
  await inheritedRoot.evaluate(
    /** Mark the provider-selected server element before hydration. */
    (element) => element.setAttribute('data-provider-server-node', 'true'),
  );
  await customRoot.evaluate(
    /** Mark the custom server root before browser hydration. */
    (element) => element.setAttribute('data-custom-server-node', 'true'),
  );
  await customCode.evaluate(
    /** Mark the custom server code node before browser hydration. */
    (element) => element.setAttribute('data-custom-code-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture browser errors during hydration and a reactive source update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateCodeBlockInBrowser);
  await expect(page.locator('#code-block-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(code).toHaveAttribute('data-server-node', 'true');
  await expect(collapse).toHaveAttribute('data-server-collapse', 'true');
  await expect(collapse).toHaveAccessibleName('Toggle hydrated code');
  await expect(collapse).toHaveAttribute('aria-controls', 'hydrated-code-block-content');
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await expect(inheritedRoot).toHaveAttribute('data-provider-server-node', 'true');
  await expect(inheritedRoot).toHaveCSS('border-radius', '6px');
  await expect(code).toHaveCSS('padding-left', '16px');
  await expect(customRoot).toHaveAttribute('data-custom-server-node', 'true');
  await expect(customCode).toHaveAttribute('data-custom-code-node', 'true');
  await expect(customRoot).toHaveCSS('border-radius', '23px');
  await expect(customRoot).toHaveCSS('border-top-width', '4px');
  await expect(customRoot.locator('pre')).toHaveCSS('font-size', '19px');
  await expect(customCode).toHaveText('const custom = true');

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(inheritedRoot).toHaveCSS('border-radius', '12px');
  await expect(code).toHaveCSS('padding-left', '20px');
  await expect(code).toHaveAttribute('data-server-node', 'true');

  await page.locator('#code-block-hydration-toggle').click();
  await expect(code).toHaveText('one\ntwo\nthree');
  await expect(code).toHaveAttribute('data-server-node', 'true');
  await expect(inheritedRoot).toHaveAttribute('data-provider-server-node', 'true');
  await expect(inheritedRoot).toHaveCSS('border-radius', '6px');
  await expect(code).toHaveCSS('padding-left', '16px');

  await page.setViewportSize({ width: 600, height: 800 });
  await expect(inheritedRoot).toHaveCSS('border-radius', '8px');
  await expect(code).toHaveCSS('padding-left', '16px');
  await expect(content).toHaveAttribute('aria-expanded', 'true');
  await collapse.focus();
  await page.keyboard.press('Enter');
  await expect(collapse).toBeFocused();
  await expect(collapse).toHaveAttribute('aria-expanded', 'false');
  await expect(content).toHaveAttribute('aria-expanded', 'false');
  await expect(collapse).toHaveAccessibleName('Toggle hydrated code');
  await page.keyboard.press('Space');
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await expect(content).toHaveAttribute('aria-expanded', 'true');
  await expect(collapse).toHaveAttribute('data-server-collapse', 'true');
  expect(errors).toEqual([]);
}

test('published Code Block hydrates and updates native code', verifiesCodeBlockHydration);
