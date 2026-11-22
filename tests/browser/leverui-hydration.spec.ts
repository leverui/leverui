import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import { readFile } from 'node:fs/promises';
import type { Box as BoxExport } from '../../src';

// The server bundle has one shared declaration entry at dist/index.d.ts.
const serverEntry = '../../dist/server/index.js';
type ServerExports = { Box: typeof BoxExport };
const { Box } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the fixture through the Storybook browser module graph. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateExample(root);
}

/** Verify authored CSS survives hydration without injected styles or replaced nodes. */
async function verifiesStyledHydration({ page }: { page: Page }): Promise<void> {
  /** Render the same tree as the browser fixture through server exports. */
  function renderExample() {
    return createComponent(Box, {
      'data-testid': 'hydrated-box',
      class: 'hydrated-box',
      children: 'Hydrated',
    });
  }

  const markup = renderToString(renderExample);

  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.hydrated-box { color: rebeccapurple; }</style><div id="hydration-root">${markup}</div>`,
  );

  const box = page.getByTestId('hydrated-box');
  await box.evaluate(
    /** Mark the server node so the hydration assertion checks identity. */
    (element) => element.setAttribute('data-before-hydration', 'true'),
  );
  const errors: string[] = [];
  /** Collect browser errors raised while hydration attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);

  await expect(box).toHaveText('Hydrated');
  await expect(box).toHaveAttribute('data-before-hydration', 'true');
  await expect(box).toHaveCSS('color', 'rgb(102, 51, 153)');
  expect(errors).toEqual([]);
}

test('hydrates a server-rendered element with authored CSS', verifiesStyledHydration);
