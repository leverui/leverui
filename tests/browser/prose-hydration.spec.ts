import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderProseHydrationTree,
  type ProseHydrationComponents,
} from '../../.storybook/prose-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ProseHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the public browser module inside the Storybook test page. */
async function hydrateProseInBrowser(): Promise<void> {
  const modulePath = '/.storybook/prose-hydration-example.ts';
  const { hydrateProseExample } = await import(modulePath);
  const root = document.getElementById('prose-hydration-root');
  if (!root) throw new Error('Prose hydration root was not found.');
  hydrateProseExample(root);
}

/** Verify SSR markup survives hydration and reactive typography updates. */
async function verifiesProseHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderProseHydrationTree(server),
  );
  expect(markup).toContain('<article');
  expect(markup).toContain('leverui-prose');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="prose-hydration-root">${markup}</div>`,
  );
  const prose = page.locator('#hydrated-prose');
  await expect(prose).toHaveAttribute('data-size', 'md');
  await prose.evaluate(
    /** Mark the original server element before hydration. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const initialFontSize = await prose.evaluate(
    /** Read the initial CSS typography scale. */
    (element) => getComputedStyle(element).fontSize,
  );
  await page.evaluate(hydrateProseInBrowser);
  await expect(page.locator('#prose-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(prose).toHaveAttribute('data-server-node', 'true');
  await page.locator('#prose-size-toggle').click();
  await expect(prose).toHaveAttribute('data-size', 'lg');
  expect(
    await prose.evaluate(
      /** Read the live CSS typography scale. */
      (element) => getComputedStyle(element).fontSize,
    ),
  ).not.toBe(initialFontSize);
}

test('Prose hydrates on its server element and updates CSS choices', verifiesProseHydration);
