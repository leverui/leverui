import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderIconHydrationTree,
  renderProviderIconHydrationTree,
  renderSimpleIconHydrationTree,
  type IconHydrationComponents,
} from '../../.storybook/icon-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as IconHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published plain Icon to its server SVG node. */
async function hydrateSimpleIconInBrowser(): Promise<void> {
  const modulePath = '/.storybook/icon-hydration-example.tsx';
  const { hydrateSimpleIconExample } = await import(modulePath);
  const root = document.getElementById('simple-icon-hydration-root');
  if (!root) throw new Error('Simple Icon hydration root was not found.');
  hydrateSimpleIconExample(root);
}

/** Isolate hydration of the native styled SVG without child composition. */
async function verifiesSimpleIconHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render a single SVG from the published server package. */
    () => renderSimpleIconHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="simple-icon-hydration-root">${markup}</div>`,
  );
  const icon = page.locator('#hydrated-simple-icon');
  await expect(icon).toHaveCSS('width', '16px');
  await icon.evaluate(
    /** Mark the server SVG before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await page.evaluate(hydrateSimpleIconInBrowser);
  await expect(page.locator('#simple-icon-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(icon).toHaveAttribute('data-server-node', 'true');
}

/** Attach a provider-owned Icon to its server SVG. */
async function hydrateProviderIconInBrowser(): Promise<void> {
  const modulePath = '/.storybook/icon-hydration-example.tsx';
  const { hydrateProviderIconExample } = await import(modulePath);
  const root = document.getElementById('provider-icon-hydration-root');
  if (!root) throw new Error('Provider Icon hydration root was not found.');
  hydrateProviderIconExample(root);
}

/** Verify a provider-owned Icon retains its original SVG node. */
async function verifiesProviderIconHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same nested tree from the published server package. */
    () => renderProviderIconHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="provider-icon-hydration-root">${markup}</div>`,
  );
  const nodes = [page.locator('#hydrated-provider-icon'), page.locator('#hydrated-provider-path')];
  for (const node of nodes) {
    await node.evaluate(
      /** Mark each server node before hydration. */
      (element) => element.setAttribute('data-server-node', 'true'),
    );
  }
  await page.evaluate(hydrateProviderIconInBrowser);
  await expect(page.locator('#provider-icon-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  for (const node of nodes) await expect(node).toHaveAttribute('data-server-node', 'true');
}

/** Hydrate the server-rendered SVGs through the published browser entry. */
async function hydrateIconsInBrowser(): Promise<void> {
  const modulePath = '/.storybook/icon-hydration-example.tsx';
  const { hydrateIconExample } = await import(modulePath);
  const root = document.getElementById('icon-hydration-root');
  if (!root) throw new Error('Icon hydration root was not found.');
  hydrateIconExample(root);
}

/** Preserve native and created SVG nodes across hydration and provider changes. */
async function verifiesIconHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared Icon tree from the published server package. */
    () => renderIconHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="icon-hydration-root">${markup}</div>`,
  );
  const icon = page.locator('#hydrated-icon');
  const created = page.locator('#hydrated-created-icon');
  const custom = page.locator('#hydrated-created-custom-icon');
  const paths = [
    page.locator('#hydrated-icon-path'),
    page.locator('#hydrated-created-icon path'),
    page.locator('#hydrated-created-circle'),
  ];
  await expect(icon).toHaveCSS('width', '12px');
  await expect(created).toHaveCSS('width', '12px');
  await expect(custom).toHaveCSS('width', '12px');
  await expect(icon).toHaveAttribute('title', 'Small icon');
  for (const element of [icon, created, custom, ...paths]) {
    await element.evaluate(
      /** Mark an original server SVG or child node before hydration. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Collect browser errors during hydration and a reactive update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateIconsInBrowser);
  await expect(page.locator('#icon-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const element of [icon, created, custom, ...paths]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  await page.locator('#icon-hydration-toggle').click();
  await expect(icon).toHaveCSS('width', '24px');
  await expect(created).toHaveCSS('width', '24px');
  await expect(custom).toHaveCSS('width', '24px');
  await expect(icon).toHaveAttribute('title', 'Large icon');
  for (const element of [icon, created, custom, ...paths]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  expect(errors).toEqual([]);
}

test('published plain Icon hydrates its native SVG', verifiesSimpleIconHydration);
test('published provider Icon hydrates its native SVG path', verifiesProviderIconHydration);

test(
  'published native and created Icons hydrate without replacing SVG nodes',
  verifiesIconHydration,
);
