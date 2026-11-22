import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server-rendered thumb so replacement is visible after hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared Slider tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/slider-hydration-example.tsx';
  const { hydrateSliderExample } = await import(modulePath);
  const root = document.getElementById('slider-hydration-root');
  if (!root) throw new Error('Slider hydration root was not found.');
  hydrateSliderExample(root);
}

/** Preserve both native values and server nodes through hydrated interaction. */
async function verifiesSliderHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/slider-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="slider-hydration-root">${markup}</div>`,
  );
  // Zag hides server-rendered thumbs until the client measures their size.
  const thumbs = page.locator('[role="slider"]');
  await expect(thumbs).toHaveCount(2);
  const primary = thumbs.nth(0);
  const external = thumbs.nth(1);
  await expect(primary).toHaveAttribute('aria-valuenow', '30');
  await expect(external).toHaveAttribute('aria-valuenow', '40');
  await primary.evaluate(markServerNode);
  await external.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record any published-browser error during hydration or interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#slider-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(primary).toHaveAttribute('data-server-node', 'true');
  await expect(external).toHaveAttribute('data-server-node', 'true');
  await expect(primary).toBeVisible();
  await expect(external).toBeVisible();
  await primary.focus();
  await primary.press('ArrowRight');
  await external.focus();
  await external.press('ArrowRight');
  await expect(primary).toHaveAttribute('aria-valuenow', '35');
  await expect(external).toHaveAttribute('aria-valuenow', '41');
  expect(
    await page.getByTestId('hydrated-slider-form').evaluate(
      /** Read both native values after interacting with the root modes. */
      (form) => Object.fromEntries(new FormData(form as HTMLFormElement)),
    ),
  ).toEqual({ 'primary-volume': '35', 'external-volume': '41' });
  expect(errors).toEqual([]);
}

test('published Slider hydrates both root modes and their native values', verifiesSliderHydration);
