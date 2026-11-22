import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderRadiomarkHydrationTree,
  type RadiomarkHydrationComponents,
} from '../../.storybook/radiomark-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as RadiomarkHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to the existing server mark. */
async function hydrateRadiomarkInBrowser(): Promise<void> {
  const modulePath = '/.storybook/radiomark-hydration-example.ts';
  const { hydrateRadiomarkExample } = await import(modulePath);
  const host = document.getElementById('radiomark-hydration-root');
  if (!host) throw new Error('Radiomark hydration root was not found.');
  hydrateRadiomarkExample(host);
}

/** Verify dot, size, and native node continuity through hydration. */
async function verifiesRadiomarkHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Build the published server tree before attaching the browser bundle. */
    () => renderRadiomarkHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="radiomark-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#radiomark-hydration-root');
  const mark = page.locator('#hydrated-radiomark');
  await expect(mark).toHaveCSS('width', '12px');
  await mark.evaluate(
    /** Identify the server span before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser errors. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Record hydration mismatch warnings. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      /error|warning/.test(message.type()) &&
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    ) {
      errors.push(message.text());
    }
  }

  page.on('pageerror', recordPageError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateRadiomarkInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(mark).toHaveAttribute('data-server-node', 'true');
  await page.locator('#radiomark-hydration-toggle').click();
  await expect(mark).toHaveAttribute('data-checked', '');
  await expect(mark.locator('.dot')).toHaveCount(1);
  await expect(mark).toHaveCSS('width', '24px');
  await expect(mark).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Radiomark hydrates its conditional dot and live size', verifiesRadiomarkHydration);
