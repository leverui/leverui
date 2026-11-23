import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const rendererPath = fileURLToPath(
  new URL('../../scripts/render-list-hydration.mjs', import.meta.url),
);

/** Render List JSX through the package's published server entry. */
function renderServerMarkup(): string {
  return execFileSync(process.execPath, [rendererPath], { encoding: 'utf8' });
}

/** Hydrate the existing server nodes with published browser components. */
async function hydratePublishedList(): Promise<void> {
  const modulePath = '/.storybook/list-hydration-example.tsx';
  const { hydrateListExample } = await import(modulePath);
  const root = document.getElementById('list-hydration-root');
  if (!root) throw new Error('List hydration root was not found.');
  hydrateListExample(root);
}

/** Preserve nested lists, styles, and native node identity through hydration. */
async function verifiesListHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderServerMarkup();
  expect(markup).toContain('hydrated-nested-list');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="list-hydration-root">${markup}</div>`,
  );
  const ids = [
    'hydrated-list',
    'hydrated-list-item',
    'hydrated-list-indicator',
    'hydrated-icon-item',
    'hydrated-list-svg',
    'hydrated-nested-list',
    'hydrated-nested-item',
  ];
  await expect(page.locator('#hydrated-list-item')).toHaveCSS('display', 'list-item');
  const icon = page.locator('#hydrated-list-svg');
  await expect(icon).toHaveJSProperty('tagName', 'svg');
  await expect(icon).toHaveClass(/lui-list__indicator/);
  const serverIconColor = await icon.evaluate(
    /** Capture the server-rendered SVG color before hydration. */
    (element) => getComputedStyle(element).color,
  );
  for (const id of ids) {
    await page.locator(`#${id}`).evaluate(
      /** Mark an existing server node before browser hydration. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Record browser errors during hydration and reactive updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePublishedList);
  await expect(page.locator('#list-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const id of ids)
    await expect(page.locator(`#${id}`)).toHaveAttribute('data-server-node', 'true');
  await expect(icon).toHaveAttribute('data-hydrated-parent-ref', 'received');
  await expect(icon).toHaveAttribute('data-hydrated-child-ref', 'received');
  await expect(icon).toHaveCSS('color', serverIconColor);
  await page.locator('#list-hydration-toggle').click();
  await expect(page.locator('#hydrated-list-item')).toHaveCSS('display', 'flex');
  await expect(page.locator('#hydrated-nested-item')).toHaveCSS('display', 'list-item');
  await expect(icon).toHaveAttribute('data-server-node', 'true');
  await expect(icon).toHaveCSS('display', 'block');
  expect(errors).toEqual([]);
}

test('published List hydrates nested native parts', verifiesListHydration);
