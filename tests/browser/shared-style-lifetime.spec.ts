import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderSharedStyleExample } from '../../.storybook/shared-style-example';
import type { Box as BoxExport } from '../../src';

type ServerParts = { Box: typeof BoxExport };
const serverEntry = '../../dist/server/index.js';
const serverParts = (await import(serverEntry)) as ServerParts;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Build the shared-rule tree from the package's server exports. */
function renderServerExample(): JSX.Element {
  return renderSharedStyleExample(serverParts);
}

/** Attach Solid to the server-rendered pair without replacing the elements. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/shared-style-hydration.ts';
  const { hydrateSharedStyleExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateSharedStyleExample(root);
}

/** Mark the surviving sibling so the test detects an element replacement. */
function markSibling(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Keep a shared authored CSS rule effective after its first component unmounts. */
async function verifiesSharedRuleLifetime({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerExample);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.shared-padding { padding: var(--leverui-spacing-4); }</style><div id="hydration-root">${markup}</div>`,
  );

  const second = page.locator('#second-shared');
  await expect(page.locator('#first-shared')).toHaveCSS('padding', '16px');
  await expect(second).toHaveCSS('padding', '16px');
  await second.evaluate(markSibling);

  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(second).toHaveAttribute('data-before-hydration', 'true');

  await page.locator('#remove-first').click();
  await expect(page.locator('#first-shared')).toHaveCount(0);
  await expect(second).toHaveAttribute('data-before-hydration', 'true');
  await expect(second).toHaveCSS('padding', '16px');
}

test(
  'an authored CSS rule remains effective after its first sibling unmounts',
  verifiesSharedRuleLifetime,
);
