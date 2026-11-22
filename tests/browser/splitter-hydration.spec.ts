import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { SplitterHydrationComponents } from '../../.storybook/splitter-hydration-tree';
import { renderSplitterHydrationTree } from '../../.storybook/splitter-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SplitterHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the shared Splitter tree from Storybook's browser runtime. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/splitter-hydration-example.tsx';
  const { hydrateSplitterExample } = await import(modulePath);
  const target = document.getElementById('splitter-hydration-root');
  if (!target) throw new Error('Splitter hydration root was not found.');
  hydrateSplitterExample(target);
}

/** Verify native nodes and ARIA links survive interactive hydration. */
async function verifiesSplitterHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render using the published server export surface. */
    () => renderSplitterHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="splitter-hydration-root">${markup}</div>`,
  );
  const root = page.locator('[data-splitter-root]');
  const panel = page.getByTestId('hydrated-splitter-a');
  const trigger = page.getByRole('separator', { name: 'Resize' });
  await expect(trigger).toHaveAttribute('role', 'separator');
  const panelId = await panel.getAttribute('id');
  const triggerId = await trigger.getAttribute('id');
  if (!panelId || !triggerId) throw new Error('Server Splitter IDs are missing.');
  await expect(trigger).toHaveAttribute('aria-controls', /hydrated-splitter/);
  for (const element of [root, panel, trigger]) {
    await element.evaluate(
      /** Mark each original server element before hydration. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Capture browser exceptions raised during hydration and resize. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#splitter-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const element of [root, panel, trigger]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  await expect(panel).toHaveAttribute('id', panelId);
  await expect(trigger).toHaveAttribute('id', triggerId);
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(trigger).toHaveAttribute('aria-valuenow', '41');
  expect(errors).toEqual([]);
}

test(
  'published Splitter hydrates without replacing panels and remains interactive',
  verifiesSplitterHydration,
);
