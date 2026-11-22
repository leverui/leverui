import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const rendererPath = fileURLToPath(
  new URL('../../scripts/render-icon-jsx-hydration.mjs', import.meta.url),
);

/** Compile the same TSX module in server mode without changing package source. */
function renderPublishedJsxMarkup(): string {
  return execFileSync(process.execPath, [rendererPath], { encoding: 'utf8' });
}

/** Attach the published browser package to the server's JSX SVG nodes. */
async function hydratePublishedJsx(): Promise<void> {
  const modulePath = '/.storybook/icon-jsx-hydration-example.tsx';
  const { hydrateIconJsxExample } = await import(modulePath);
  const root = document.getElementById('jsx-icon-hydration-root');
  if (!root) throw new Error('JSX Icon hydration root was not found.');
  hydrateIconJsxExample(root);
}

/** Preserve documented JSX SVG children through published package hydration. */
async function verifiesJsxHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderPublishedJsxMarkup();
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="jsx-icon-hydration-root">${markup}</div>`,
  );
  const icon = page.locator('#jsx-hydrated-icon');
  const path = page.locator('#jsx-hydrated-path');
  await expect(icon).toHaveCSS('width', '16px');
  await expect(icon).toHaveAttribute('title', 'JSX icon');
  await expect(path).toHaveAttribute('d', 'M2 2h20v20H2z');
  for (const element of [icon, path]) {
    await element.evaluate(
      /** Mark each server node before Solid hydration. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Collect any hydration errors from the browser. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePublishedJsx);
  await expect(page.locator('#jsx-icon-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const element of [icon, path]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  expect(errors).toEqual([]);
}

test('published Icon hydrates ordinary JSX SVG children', verifiesJsxHydration);
