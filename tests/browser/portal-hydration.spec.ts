import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Portal as PortalExport } from '../../src';
import { renderPortalHydrationTree } from '../../.storybook/portal-hydration-tree';

type ServerExports = { Portal: typeof PortalExport };
const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;

/** Load the browser implementation after placing published server markup. */
async function hydratePortalInBrowser(): Promise<void> {
  const modulePath = '/.storybook/portal-hydration-example.tsx';
  const { hydratePortalExample } = await import(modulePath);
  const root = document.getElementById('portal-hydration-root');
  if (!root) throw new Error('Portal hydration root was not found.');
  hydratePortalExample(root);
}

/** Verify a late custom container receives the original server child. */
async function verifiesCustomPortalHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render through the published package's server entry. */
    () => renderPortalHydrationTree(components.Portal),
  );
  expect(markup).toContain('Custom portal content');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<div id="portal-hydration-root">${markup}</div>`,
  );
  const content = page.getByTestId('portal-hydration-content');
  const destination = page.getByTestId('portal-hydration-container');
  await expect(content).toHaveCount(1);
  await expect(destination.getByTestId('portal-hydration-content')).toHaveCount(0);
  await content.evaluate(
    /** Tag the server element so replacement during hydration is visible. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Capture exceptions raised while hydrating the custom portal. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePortalInBrowser);
  await expect(page.locator('#portal-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(destination.getByTestId('portal-hydration-content')).toHaveCount(1);
  await expect(content).toHaveAttribute('data-server-element', 'true');
  await expect(content).toHaveCount(1);
  expect(errors).toEqual([]);
}

test('published Portal hydrates into a late custom container', verifiesCustomPortalHydration);
