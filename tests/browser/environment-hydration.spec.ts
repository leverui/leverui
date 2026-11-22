import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type {
  EnvironmentProvider as EnvironmentProviderExport,
  Portal as PortalExport,
  useEnvironmentContext as useEnvironmentContextExport,
} from '../../src';
import { renderEnvironmentHydrationTree } from '../../.storybook/environment-hydration-tree';

type ServerExports = {
  EnvironmentProvider: typeof EnvironmentProviderExport;
  Portal: typeof PortalExport;
  useEnvironmentContext: typeof useEnvironmentContextExport;
};
const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;

/** Hydrate the published tree through the browser source exports. */
async function hydrateEnvironmentInBrowser(): Promise<void> {
  const modulePath = '/.storybook/environment-hydration-example.tsx';
  const { hydrateEnvironmentExample } = await import(modulePath);
  const root = document.getElementById('environment-hydration-root');
  if (!root) throw new Error('Environment hydration root was not found.');
  hydrateEnvironmentExample(root);
}

/** Verify the hidden root marker and portal survive hydration. */
async function verifiesEnvironmentHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render through the published package server entry. */
    () => renderEnvironmentHydrationTree(components),
  );
  expect(markup).toContain('Portalled after hydration');
  expect(markup).toContain('server');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<div id="environment-hydration-root">${markup}</div>`,
  );
  const stable = page.getByTestId('environment-hydration-stable');
  await stable.evaluate(
    /** Mark the server node to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Capture browser errors raised during hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateEnvironmentInBrowser);
  await expect(page.locator('#environment-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(stable).toHaveAttribute('data-server-element', 'true');
  await expect(page.getByTestId('environment-hydrated-root')).toHaveText('#document');
  await expect(page.getByTestId('environment-hydrated-portal')).toBeVisible();
  expect(
    await page.getByTestId('environment-hydrated-portal').evaluate(
      /** Confirm the default portal moved into the selected document. */
      (element) => element.parentElement?.parentElement === document.body,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
}

test('published EnvironmentProvider and Portal hydrate together', verifiesEnvironmentHydration);
