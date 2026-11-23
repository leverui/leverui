import { enableBrowserClipboard } from './clipboard-test-setup';
import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser Clipboard to server-rendered markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/clipboard-hydration-example.tsx';
  const { hydrateClipboardExample } = await import(modulePath);
  const host = document.getElementById('clipboard-hydration-root');
  if (!host) throw new Error('Clipboard hydration root was not found.');
  hydrateClipboardExample(host);
}

/** Keep native nodes, IDs, and copy behavior through hydration. */
async function verifiesClipboardHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/clipboard-hydration.html', import.meta.url),
    'utf8',
  );
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="clipboard-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#clipboard-hydration-root');
  const root = host.locator('.lui-clipboard__root');
  const input = host.locator('input');
  const trigger = host.getByRole('button', { name: 'Copy to clipboard' });
  const label = host.getByText('Hydrated label');
  await expect(input).toHaveValue('Hydrated copy value');
  await expect(input).toHaveAttribute('id', /.+/);
  expect(await label.getAttribute('for')).toBe(await input.getAttribute('id'));
  await expect(trigger).toHaveAttribute('type', 'button');
  // Zag 2 gives the root no `id`; the scoped part attribute keeps the server ID.
  const rootId = await root.getAttribute('data-clipboard-root');
  const inputId = await input.getAttribute('id');
  await expect(root).toHaveAttribute('data-clipboard-root', /.+/);
  await root.evaluate(
    /** Identify the exact server root after the client attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await input.evaluate(
    /** Identify the exact server input after the client attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect client exceptions instead of relying on the page appearance. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Collect hydration warnings and browser console errors. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      message.type() === 'error' ||
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    )
      errors.push(message.text());
  }

  page.on('pageerror', recordError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(input).toHaveAttribute('data-server-node', 'true');
  expect(await root.getAttribute('data-clipboard-root')).toBe(rootId);
  expect(await input.getAttribute('id')).toBe(inputId);
  await trigger.focus();
  await trigger.press('Enter');
  await expect(host.getByRole('button', { name: 'Copied to clipboard' })).toBeVisible();
  expect(
    await page.evaluate(
      /** Confirm the hydrated trigger writes through the browser Clipboard API. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('Hydrated copy value');
  expect(errors).toEqual([]);
}

test('published Clipboard hydrates its server nodes and copies', verifiesClipboardHydration);
