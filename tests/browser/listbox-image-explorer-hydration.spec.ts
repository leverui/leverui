import { readFile } from 'node:fs/promises';
import { expect, test, type Page, type Route } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import { imageFixtureSvg } from '../fixtures/listbox-image-explorer-media';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Serve one stable image while the server and browser markup are compared. */
async function serveImage(route: Route): Promise<void> {
  await route.fulfill({
    contentType: 'image/svg+xml',
    body: imageFixtureSvg,
  });
}

/** Mark server elements before Solid attaches to them. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the published browser entry over the published server fixture. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-image-explorer-hydration-example.tsx';
  const { hydrateListboxImageExplorer } = await import(modulePath);
  const root = document.getElementById('listbox-image-explorer-hydration-root');
  if (!root) throw new Error('Image explorer hydration root was not found.');
  hydrateListboxImageExplorer(root);
}

/** Verify the selected image and option nodes survive hydration and react. */
async function verifiesImageExplorerHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-image-explorer-hydration.html', import.meta.url),
    'utf8',
  );
  await page.route('**/demo-images/**', serveImage);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-image-explorer-hydration-root">${markup}</div>`,
  );
  const listbox = page.getByRole('listbox', { name: 'Explore images' });
  const options = listbox.getByRole('option');
  const selectedOption = options.first();
  const initialImage = page.getByRole('img', { name: 'Snowy peaks' });
  const styleCount = await page.locator('style').count();
  await expect(options).toHaveCount(5);
  await expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  await selectedOption.evaluate(markServerNode);
  await initialImage.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture hydration and later selection exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#listbox-image-explorer-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(options).toHaveCount(5);
  await expect(selectedOption).toHaveAttribute('data-server-node', 'true');
  await expect(initialImage).toHaveAttribute('data-server-node', 'true');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await options.nth(1).click();
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('img', { name: 'Breaking wave' })).toBeVisible();
  await expect(page.getByText('A wave rising under evening clouds')).toBeVisible();
  await listbox.focus();
  const lastId = await options.last().getAttribute('id');
  await listbox.press('End');
  await expect(options.last()).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute('aria-activedescendant', lastId ?? '');
  await expect(listbox).toBeFocused();
  await listbox.press('Enter');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('img', { name: 'Sand dunes' })).toBeVisible();
  await expect(listbox).toBeFocused();
  expect(errors).toEqual([]);
}

test('published image explorer hydrates and changes its preview', verifiesImageExplorerHydration);
