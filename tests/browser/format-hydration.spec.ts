import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderFormatHydrationTree,
  type FormatHydrationComponents,
} from '../../.storybook/format-hydration-tree';

const serverEntry = '../../dist/server/index.js';
/** Assume the emitted server entry matches source types; rendering exercises each export. */
const server = (await import(serverEntry)) as FormatHydrationComponents;

/** Format the fixture amount as localized USD currency. */
function currency(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value);
}

/** Format the fixture size using Zag's decimal scaling and precision. */
function bytes(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, { style: 'unit', unit: 'kilobyte' }).format(
    Number((value / 1000).toPrecision(3)),
  );
}

/** Hydrate the server's Format tree with the published browser entry. */
async function hydrateFormatInBrowser(): Promise<void> {
  const modulePath = '/.storybook/format-hydration-example.ts';
  const { hydrateFormatExample } = await import(modulePath);
  const root = document.getElementById('format-hydration-root');
  if (!root) throw new Error('Format hydration root was not found.');
  hydrateFormatExample(root);
}

/** Verify text and consumer-owned nodes survive hydration and live updates. */
async function verifiesFormatHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through the published server components. */
    () => renderFormatHydrationTree(server),
  );
  expect(markup).toContain(currency('en-US', 1450.45));
  expect(markup).toContain(bytes('en-US', 1450.45));
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<div id="format-hydration-root">${markup}</div>`,
  );
  const stable = page.getByTestId('format-hydration-stable');
  const number = page.getByTestId('format-hydration-number');
  const byte = page.getByTestId('format-hydration-byte');
  for (const element of [stable, number, byte]) {
    await element.evaluate(
      /** Mark each server node so replacement becomes observable. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Collect browser exceptions raised during hydration and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFormatInBrowser);
  await expect(page.locator('#format-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(number).toHaveText(currency('en-US', 1450.45));
  await expect(byte).toHaveText(bytes('en-US', 1450.45));
  for (const element of [stable, number, byte]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }

  await page.getByTestId('format-hydration-toggle').click();
  await expect(number).toHaveText(currency('de-DE', 2500.5));
  await expect(byte).toHaveText(bytes('de-DE', 2500.5));
  await expect(number).toHaveCount(1);
  await expect(byte).toHaveCount(1);
  for (const element of [stable, number, byte]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  expect(errors).toEqual([]);
}

test(
  'published Format text hydrates and updates without replacing consumer nodes',
  verifiesFormatHydration,
);
