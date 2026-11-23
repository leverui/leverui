import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderConsumerSpacingExample } from '../../.storybook/consumer-spacing-example';
import type { Box as BoxExport } from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as { Box: typeof BoxExport };
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = await readFile(
  new URL('../../.storybook/consumer-spacing-example.css', import.meta.url),
  'utf8',
);

/** Render the consumer CSS fixture through the published server Box. */
function renderServerExample(): JSX.Element {
  return renderConsumerSpacingExample(server);
}

/** Attach the browser tree to its existing server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/consumer-spacing-hydration-example.tsx';
  const { hydrateConsumerSpacingExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateConsumerSpacingExample(root);
}

/** Mark the server element so hydration must preserve its identity. */
function markElement(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Check class-based spacing before scripts and after reactive hydration. */
async function verifiesConsumerSpacingHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerExample);
  expect(markup).toContain('id="consumer-spacing-box"');
  expect(markup).toContain('consumer-spacing-compact');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${consumerCss}</style><div id="hydration-root">${markup}</div>`,
  );

  const box = page.locator('#consumer-spacing-box');
  await expect(box).toHaveCSS('margin-left', '4px');
  const errors: string[] = [];

  /** Keep hydration and the native button interaction free of browser errors. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await box.evaluate(markElement);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(box).toHaveAttribute('data-before-hydration', 'true');
  await expect(box).toHaveCSS('margin-left', '4px');
  await page.getByRole('button', { name: 'Toggle spacing' }).click();
  await expect(box).toHaveClass(/consumer-spacing-roomy/);
  await expect(box).toHaveCSS('margin-left', '12px');
  await expect(box).toHaveAttribute('data-before-hydration', 'true');
  await page.addStyleTag({ content: ':root { --lui-spacing-3: 14px; }' });
  await expect(box).toHaveCSS('margin-left', '14px');
  expect(errors).toEqual([]);
}

test(
  'consumer CSS spacing changes after hydration without inserted styles',
  verifiesConsumerSpacingHydration,
);
