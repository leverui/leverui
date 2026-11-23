import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser Toggle to the server-rendered button. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/toggle-hydration-example.tsx';
  const { hydrateToggleExample } = await import(modulePath);
  const root = document.getElementById('toggle-hydration-root');
  if (!root) throw new Error('Toggle hydration root was not found.');
  hydrateToggleExample(root);
}

/** Preserve the server button and its state through hydration and keyboard use. */
async function verifiesToggleHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/toggle-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="toggle-hydration-root">${markup}</div>`,
  );
  const root = page.getByRole('button', { name: 'Hydrated Bold' });
  const styled = page.getByRole('button', { name: 'Hydrated Styled Bold' });
  const indicator = page.locator('#toggle-hydration-root .lui-toggle__indicator');
  await expect(root).toHaveAttribute('aria-pressed', 'false');
  await expect(styled).toHaveAttribute('aria-pressed', 'false');
  await expect(indicator).toHaveText(['Off', 'Styled off']);
  await root.evaluate(
    /** Mark the existing server node so replacement is visible. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await styled.evaluate(
    /** Mark the styled child to detect replacement during hydration. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture hydration and subsequent interaction exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#toggle-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(styled).toHaveAttribute('data-server-node', 'true');
  await root.focus();
  await root.press('Space');
  await expect(root).toHaveAttribute('aria-pressed', 'true');
  await expect(indicator).toHaveText(['On', 'Styled off']);
  await styled.click();
  await expect(styled).toHaveAttribute('aria-pressed', 'true');
  await expect(styled).toContainText('Styled on');
  await styled.press('Space');
  await expect(styled).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Hydrated Styled Bold' })).toBeVisible();
  expect(errors).toEqual([]);
}

test('published Toggle hydrates its server button and accepts Space', verifiesToggleHydration);
