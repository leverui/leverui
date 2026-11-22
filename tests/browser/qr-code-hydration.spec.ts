import { readFile } from 'node:fs/promises';
import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderQrCodeHydrationTree,
  type QrCodeHydrationComponents,
} from '../../.storybook/qr-code-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as QrCodeHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the QR tree using the browser's module runtime. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/qr-code-hydration-example.tsx';
  const { hydrateQrCodeExample } = await import(modulePath);
  const target = document.getElementById('qr-hydration-root');
  if (!target) throw new Error('QR hydration root was not found.');
  hydrateQrCodeExample(target);
}

/** Preserve encoded SVG nodes and external state across hydration. */
async function verifiesQrHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use published server exports for the initial render. */
    () => renderQrCodeHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="qr-hydration-root">${markup}</div>`,
  );
  // Zag 2 writes a root's machine id only on its scoped part attribute; parts
  // carry the DOM ids the fixture passes to them.
  const nodes = [
    '[data-qr-code-root="hydrated-qr-root"]',
    '#hydrated-qr-frame',
    '#hydrated-qr-overlay',
    '[data-qr-code-root]:has(> #hydrated-qr-external-frame)',
    '#hydrated-qr-external-frame',
  ];
  const path = page.locator('#hydrated-qr-frame path');
  const externalPath = page.locator('#hydrated-qr-external-frame path');
  const originalPath = await path.getAttribute('d');
  const originalExternalPath = await externalPath.getAttribute('d');
  expect(originalPath).toBeTruthy();
  expect(originalExternalPath).toBeTruthy();
  for (const selector of nodes) {
    await page.locator(selector).evaluate(
      /** Mark each original published server node. */
      (element) => element.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];
  const hydrationWarnings: string[] = [];

  /** Record hydration and later machine errors. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Detect hydration diagnostics reported without a thrown exception. */
  function recordConsole(message: ConsoleMessage): void {
    if (message.type() !== 'warning' && message.type() !== 'error') return;
    if (
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    )
      hydrationWarnings.push(message.text());
  }

  page.on('pageerror', recordError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#qr-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const selector of nodes) {
    await expect(page.locator(selector)).toHaveAttribute('data-server-node', 'true');
  }
  await expect(path).toHaveAttribute('d', originalPath ?? '');
  await expect(externalPath).toHaveAttribute('d', originalExternalPath ?? '');
  await page.locator('#hydrated-qr-update').click();
  await expect(path).not.toHaveAttribute('d', originalPath ?? '');
  await expect(page.locator('[data-qr-code-root="hydrated-qr-root"]')).toHaveAttribute(
    'data-server-node',
    'true',
  );
  await page.locator('#hydrated-qr-external-update').click();
  await expect(externalPath).not.toHaveAttribute('d', originalExternalPath ?? '');
  expect(errors).toEqual([]);
  expect(hydrationWarnings).toEqual([]);
}

test('published QR Code hydrates both machine owners without replacing parts', verifiesQrHydration);
