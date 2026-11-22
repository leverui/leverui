import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { InputElementHydrationComponents } from '../../.storybook/input-element-hydration-tree';
import { renderInputElementHydrationTree } from '../../.storybook/input-element-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as InputElementHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the client element tree to the existing published server element. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/input-element-hydration-example.tsx';
  const { hydrateInputElementExample } = await import(modulePath);
  const root = document.getElementById('input-element-hydration-root');
  if (!root) throw new Error('Input Element hydration root was not found.');
  hydrateInputElementExample(root);
}

/** Preserve the server node, styling, and content through hydration. */
async function verifiesInputElementHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree with the published server components. */
    () => renderInputElementHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready&viewMode=story');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="input-element-hydration-root">${markup}</div>`,
  );
  const element = page.locator('#hydrated-input-element');
  await expect(element).toHaveText('kg');
  await expect(element).toHaveCSS('position', 'absolute');
  const originalClass = await element.getAttribute('class');
  await element.evaluate(
    /** Mark the original server element so replacement becomes observable. */
    (node) => {
      (node as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect browser errors from hydration and reactive updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#input-element-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(element).toHaveAttribute('data-server-element', 'true');
  await expect(element).toHaveAttribute('class', originalClass ?? '');
  await expect(element).toHaveText('kg');
  await page.locator('#hydrated-input-element-toggle').click();
  await expect(element).toHaveAttribute('data-server-element', 'true');
  await expect(element).toHaveAttribute('class', originalClass ?? '');
  await expect(element).toHaveAttribute('data-placement', 'end');
  expect(errors).toEqual([]);
}

test('published Input Element hydrates without replacing its node', verifiesInputElementHydration);
