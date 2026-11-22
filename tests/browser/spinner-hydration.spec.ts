import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type {
  Spinner as SpinnerExport,
  SpinnerPropsProvider as SpinnerPropsProviderExport,
} from '../../src';
import { renderSpinnerHydrationTree } from '../../.storybook/spinner-hydration-tree';

type ServerExports = {
  Spinner: typeof SpinnerExport;
  SpinnerPropsProvider: typeof SpinnerPropsProviderExport;
};

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Spinner tree to its existing server markup. */
async function hydrateSpinnerInBrowser(): Promise<void> {
  const modulePath = '/.storybook/spinner-hydration-example.tsx';
  const { hydrateSpinnerExample } = await import(modulePath);
  const root = document.getElementById('spinner-hydration-root');
  if (!root) throw new Error('Spinner hydration root was not found.');
  hydrateSpinnerExample(root);
}

/** Verify Spinner node identity, styles, and reactive defaults through hydration. */
async function verifiesSpinnerHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared Spinner tree with published server components. */
    () => renderSpinnerHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="spinner-hydration-root">${markup}</div>`,
  );
  const spinner = page.locator('#hydrated-spinner');
  await expect(spinner).toHaveCSS('width', '16px');
  await spinner.evaluate(
    /** Mark the native server element before Solid attaches to it. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Record errors raised while Spinner hydrates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateSpinnerInBrowser);
  await expect(page.locator('#spinner-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(spinner).toHaveAttribute('data-server-element', 'true');
  await expect(spinner).toHaveCSS('width', '16px');
  expect(errors).toEqual([]);
  await page.locator('#spinner-hydration-toggle').click();
  await expect(spinner).toHaveCSS('width', '32px');
}

test('Spinner hydrates without replacing its native span', verifiesSpinnerHydration);
