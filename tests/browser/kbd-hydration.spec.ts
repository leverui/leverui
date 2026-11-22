import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const rendererPath = fileURLToPath(
  new URL('../../scripts/render-kbd-hydration.mjs', import.meta.url),
);

/** Compile ordinary JSX Kbd children through the published server entry. */
function renderServerMarkup(): string {
  return execFileSync(process.execPath, [rendererPath], { encoding: 'utf8' });
}

/** Attach the published browser bundle to the server's Kbd elements. */
async function hydratePublishedKbd(): Promise<void> {
  const modulePath = '/.storybook/kbd-hydration-example.tsx';
  const { hydrateKbdExample } = await import(modulePath);
  const root = document.getElementById('kbd-hydration-root');
  if (!root) throw new Error('Kbd hydration root was not found.');
  hydrateKbdExample(root);
}

/** Preserve Kbd markup, styles, and nodes through hydration and updates. */
async function verifiesKbdHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderServerMarkup();
  expect(markup).toContain('hydrated-local-child');
  expect(markup).toContain('hydrated-shared-child');
  expect(markup).toContain('data-size="sm"');
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="kbd-hydration-root">${markup}</div>`,
  );
  const local = page.locator('#hydrated-key');
  const localChild = page.locator('#hydrated-local-child');
  const shared = page.locator('#hydrated-shared-key');
  const sharedChild = page.locator('#hydrated-shared-child');
  const selected = page.locator('#hydrated-selected-key');
  const responsive = page.locator('#hydrated-responsive-key');
  await expect(local).toHaveCSS('height', '18px');
  await expect(selected).toHaveJSProperty('tagName', 'SPAN');
  await expect(responsive).toHaveCSS('height', '18px');
  for (const element of [local, localChild, shared, sharedChild, selected, responsive]) {
    await element.evaluate(
      /** Mark each existing server node before hydration. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Capture hydration failures and reactive update errors. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePublishedKbd);
  await expect(page.locator('#kbd-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const element of [local, localChild, shared, sharedChild, selected, responsive]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  await page.locator('#kbd-hydration-toggle').click();
  await expect(local).toHaveCSS('height', '24px');
  await expect(shared).toHaveCSS('height', '24px');
  await expect(sharedChild).toHaveAttribute('data-server-node', 'true');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(responsive).toHaveCSS('height', '24px');
  expect(errors).toEqual([]);
}

test('published Kbd hydrates ordinary JSX and reactive styles', verifiesKbdHydration);
