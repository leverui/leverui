import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const rendererPath = fileURLToPath(
  new URL('../../scripts/render-link-hydration.mjs', import.meta.url),
);

/** Render ordinary Link JSX through the published server entry. */
function renderServerMarkup(): string {
  return execFileSync(process.execPath, [rendererPath], { encoding: 'utf8' });
}

/** Load the published browser components into existing server markup. */
async function hydratePublishedLink(): Promise<void> {
  const modulePath = '/.storybook/link-hydration-example.tsx';
  const { hydrateLinkExample } = await import(modulePath);
  const root = document.getElementById('link-hydration-root');
  if (!root) throw new Error('Link hydration root was not found.');
  hydrateLinkExample(root);
}

/** Preserve links and styles through hydration and a provider update. */
async function verifiesLinkHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderServerMarkup();
  expect(markup).toContain('hydrated-link-label');
  expect(markup).toContain('hydrated-overlay-link');
  expect(markup).toContain('data-variant="plain"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="link-hydration-root">${markup}</div>`,
  );
  const ids = [
    'hydrated-link',
    'hydrated-shared-link',
    'hydrated-link-label',
    'hydrated-selected-link',
    'hydrated-link-box',
    'hydrated-overlay-link',
    'hydrated-inner-link',
  ];
  const local = page.locator('#hydrated-link');
  const shared = page.locator('#hydrated-shared-link');
  await expect(local).toHaveCSS('text-decoration-line', 'none');
  await expect(page.locator('#hydrated-selected-link')).toHaveJSProperty('tagName', 'SPAN');
  for (const id of ids) {
    await page.locator(`#${id}`).evaluate(
      /** Tag an existing server node before client hydration. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Record hydration and update failures from the browser. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePublishedLink);
  await expect(page.locator('#link-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const id of ids)
    await expect(page.locator(`#${id}`)).toHaveAttribute('data-server-node', 'true');
  await page.locator('#link-hydration-toggle').click();
  await expect(local).toHaveCSS('text-decoration-line', 'underline');
  await expect(shared).toHaveCSS('text-decoration-line', 'underline');
  await expect(page.locator('#hydrated-link-label')).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Link family hydrates styled navigation', verifiesLinkHydration);
