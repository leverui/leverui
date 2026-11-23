import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server-rendered input so replacement is visible after hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared Switch tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/switch-hydration-example.tsx';
  const { hydrateSwitchExample } = await import(modulePath);
  const root = document.getElementById('switch-hydration-root');
  if (!root) throw new Error('Switch hydration root was not found.');
  hydrateSwitchExample(root);
}

/** Preserve native inputs and server nodes through hydrated interaction. */
async function verifiesSwitchHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/switch-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="switch-hydration-root">${markup}</div>`,
  );
  const inputs = page.getByRole('checkbox');
  await expect(inputs).toHaveCount(2);
  const primary = inputs.nth(0);
  const external = inputs.nth(1);
  await expect(primary).toBeChecked();
  await expect(external).not.toBeChecked();
  const primaryTrack = page.getByTestId('primary-track-indicator');
  const primaryThumb = page.getByTestId('primary-thumb-indicator');
  const externalTrack = page.getByTestId('external-track-indicator');
  const externalThumb = page.getByTestId('external-thumb-indicator');
  await expect(primaryTrack).toHaveText('Primary on');
  await expect(primaryThumb).toHaveText('✓');
  await expect(externalTrack).toHaveText('External off');
  await expect(externalThumb).toHaveText('−');
  await primary.evaluate(markServerNode);
  await external.evaluate(markServerNode);
  await primaryTrack.evaluate(markServerNode);
  await primaryThumb.evaluate(markServerNode);
  await externalTrack.evaluate(markServerNode);
  await externalThumb.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record any published-browser error during hydration or interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#switch-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(primary).toHaveAttribute('data-server-node', 'true');
  await expect(external).toHaveAttribute('data-server-node', 'true');
  for (const indicator of [primaryTrack, primaryThumb, externalTrack, externalThumb]) {
    await expect(indicator).toHaveAttribute('data-server-node', 'true');
  }
  await expect(primaryTrack).toHaveAttribute('data-checked', '');
  await expect(externalTrack).not.toHaveAttribute('data-checked');
  await primary.focus();
  await primary.press('Space');
  await external.focus();
  await external.press('Space');
  await expect(primary).not.toBeChecked();
  await expect(external).toBeChecked();
  await expect(primaryTrack).toHaveText('Primary off');
  await expect(primaryThumb).toHaveText('−');
  await expect(externalTrack).toHaveText('External on');
  await expect(externalThumb).toHaveText('✓');
  await expect(primaryTrack).not.toHaveAttribute('data-checked');
  await expect(externalTrack).toHaveAttribute('data-checked', '');
  expect(
    await page.getByTestId('hydrated-switch-form').evaluate(
      /** Read submitted native values after interacting with both root modes. */
      (form) => Object.fromEntries(new FormData(form as HTMLFormElement)),
    ),
  ).toEqual({ 'external-notifications': 'yes' });
  expect(errors).toEqual([]);
}

test('published Switch hydrates both root modes and their native values', verifiesSwitchHydration);

/** Verify server markup remains styled when no runtime style tags or app scripts run. */
async function verifiesSwitchWithoutRuntime({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/switch-hydration.html', import.meta.url),
    'utf8',
  );
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const root = page.locator('.lui-switch__root').first();
  await expect(root).toHaveAttribute('data-size', 'md');
  await expect(root.locator('.lui-switch__control')).toHaveCSS('width', '40px');
  await expect(root.locator('.lui-switch__thumb')).toHaveCSS('translate', '20px');
  await expect(root.getByRole('checkbox')).toBeChecked();
}

test(
  'server-rendered Switch uses authored CSS without runtime styles',
  verifiesSwitchWithoutRuntime,
);
