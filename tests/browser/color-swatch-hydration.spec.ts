import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderColorSwatchHydrationTree,
  type ColorSwatchHydrationComponents,
} from '../../.storybook/color-swatch-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ColorSwatchHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser behavior to the server-rendered Color Swatch tree. */
async function hydrateSwatchesInBrowser(): Promise<void> {
  const modulePath = '/.storybook/color-swatch-hydration-example.tsx';
  const { hydrateColorSwatchExample } = await import(modulePath);
  const root = document.getElementById('color-swatch-hydration-root');
  if (!root) throw new Error('Color Swatch hydration root was not found.');
  hydrateColorSwatchExample(root);
}

/** Preserve server nodes and styles while live swatches change after hydration. */
async function verifiesColorSwatchHydration({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderColorSwatchHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="color-swatch-hydration-root">${markup}</div>`,
  );
  const swatch = page.locator('#hydrated-swatch');
  const mix = page.locator('#hydrated-swatch-mix');
  await expect(swatch).toHaveAttribute('data-value', 'red');
  await expect(swatch).toHaveCSS('width', '16px');
  await expect(swatch).toHaveCSS('border-radius', '0px');
  await expect(mix).toHaveCSS('width', '16px');
  await expect(mix).toHaveCSS('border-radius', '0px');
  await expect(mix.locator('[data-value]')).toHaveCount(2);
  await expect(mix.locator('[data-value]').first()).toHaveAttribute('data-value', 'red');
  await expect(mix.locator('[data-value]').last()).toHaveAttribute('data-value', 'blue');
  await swatch.evaluate(
    /** Mark the original server-rendered swatch element. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await mix.evaluate(
    /** Mark the original server-rendered mix element. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser errors across hydration and the reactive update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateSwatchesInBrowser);
  await expect(page.locator('#color-swatch-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(swatch).toHaveAttribute('data-server-node', 'true');
  await expect(mix).toHaveAttribute('data-server-node', 'true');
  await expect(swatch).toHaveCSS('width', '16px');
  await expect(swatch).toHaveCSS('border-radius', '0px');
  await expect(mix).toHaveCSS('width', '16px');
  await expect(mix).toHaveCSS('border-radius', '0px');
  await expect(mix.locator('[data-value]')).toHaveCount(2);

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(swatch).toHaveAttribute('data-server-node', 'true');
  await expect(mix).toHaveAttribute('data-server-node', 'true');
  await expect(swatch).toHaveCSS('width', '24px');
  await expect(swatch).toHaveCSS('border-radius', '9999px');
  await expect(mix).toHaveCSS('width', '24px');
  await expect(mix).toHaveCSS('border-radius', '9999px');
  await expect(mix.locator('[data-value]')).toHaveCount(2);

  await page.locator('#swatch-hydration-toggle').click();
  await expect(swatch).toHaveAttribute('data-value', 'blue');
  await expect(swatch).toHaveAttribute('data-server-node', 'true');
  await expect(mix).toHaveAttribute('data-server-node', 'true');
  await expect(swatch).toHaveCSS('width', '28px');
  await expect(swatch).toHaveCSS('border-radius', '0px');
  await expect(mix).toHaveCSS('width', '28px');
  await expect(mix).toHaveCSS('border-radius', '0px');
  await expect(mix.locator('[data-value]')).toHaveCount(3);
  await expect(mix.locator('[data-value]').nth(1)).toHaveAttribute('data-value', 'green');

  await page.setViewportSize({ width: 600, height: 800 });
  await expect(swatch).toHaveCSS('width', '18px');
  await expect(swatch).toHaveCSS('border-radius', '9999px');
  await expect(mix).toHaveCSS('width', '18px');
  await expect(mix).toHaveCSS('border-radius', '9999px');
  await expect(mix.locator('[data-value]')).toHaveCount(3);
  expect(errors).toEqual([]);
}

test(
  'published Color Swatch and mix hydrate without replacing server nodes',
  verifiesColorSwatchHydration,
);
