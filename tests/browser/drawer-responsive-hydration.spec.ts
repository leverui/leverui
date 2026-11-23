import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { DrawerHydrationComponents } from '../../.storybook/drawer-hydration-tree';
import { renderDrawerHydrationTree } from '../../.storybook/drawer-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as DrawerHydrationComponents;
const css = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the same responsive Drawer tree the server rendered. */
async function hydrateResponsiveDrawer(): Promise<void> {
  const modulePath = '/.storybook/drawer-hydration-example.tsx';
  const { hydrateDrawerExample } = await import(modulePath);
  const root = document.getElementById('responsive-drawer-root');
  if (!root) throw new Error('Responsive Drawer hydration root was not found.');
  hydrateDrawerExample(root, true, true);
}

/** Preserve server nodes and authored choices across hydration and resize. */
async function verifiesResponsiveHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the published server entry for the initially open responsive tree. */
    () => renderDrawerHydrationTree(components, true, true),
  );
  await page.setViewportSize({ width: 700, height: 700 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${css}</style><div id="responsive-drawer-root">${markup}</div>`,
  );
  const content = page.getByTestId('hydrated-drawer-content');
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Responsive Drawer server content has no ID.');
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveAttribute('data-size-md-down', 'full');
  await expect(content).toHaveAttribute('data-placement-md-down', 'bottom');
  await expect(content).toHaveCSS('max-width', '100%');
  await expect(content).toHaveCSS('height', '700px');

  const errors: string[] = [];
  /** Record any Solid or primitive failure while client state attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateResponsiveDrawer);
  await expect(page.locator('#responsive-drawer-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveAttribute('id', id);
  await expect(content).toHaveAttribute('aria-labelledby', /.+/);
  await expect(content).toHaveCSS('max-width', '100%');
  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(content).toHaveCSS('animation-name', 'slide-from-right-full, fade-in');
  expect(errors).toEqual([]);
}

test('responsive Drawer hydrates without presentation style tags', verifiesResponsiveHydration);
