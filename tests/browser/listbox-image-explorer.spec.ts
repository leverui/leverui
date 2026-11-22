import { expect, test, type Page, type Route } from '@playwright/test';
import { explorerImages } from '../../demos/listbox-image-explorer-data';
import { imageFixtureSvg, imageFixtureWidth } from '../fixtures/listbox-image-explorer-media';

/** Serve deterministic image pixels without relying on a remote photo host. */
async function serveImage(route: Route): Promise<void> {
  await route.fulfill({
    contentType: 'image/svg+xml',
    body: imageFixtureSvg,
  });
}

/** Verify the controlled option changes the preview and preserves keyboard use. */
async function verifiesImageExplorer({ page }: { page: Page }): Promise<void> {
  await page.route('**/demo-images/**', serveImage);
  await page.goto('/iframe.html?id=components-listbox-image-explorer--explorer');
  const listbox = page.getByRole('listbox', { name: 'Explore images' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(explorerImages.length, { timeout: 30_000 });
  for (const [index, image] of explorerImages.entries()) {
    await expect(options.nth(index)).toHaveAccessibleName(image.label);
  }
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('img', { name: 'Snowy peaks' })).toHaveAttribute(
    'src',
    explorerImages[0]?.url ?? '',
  );
  await options.nth(1).click();
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(options.first()).toHaveAttribute('aria-selected', 'false');
  const ocean = page.getByRole('img', { name: 'Breaking wave' });
  await expect(ocean).toHaveAttribute('src', explorerImages[1]?.url ?? '');
  await expect(page.getByText('A wave rising under evening clouds')).toBeVisible();

  /** Read the decoded image width after the route supplies its pixels. */
  function readImageWidth(): Promise<number> {
    return ocean.evaluate(
      /** Report the native image's loaded width. */
      (image: HTMLImageElement) => image.naturalWidth,
    );
  }

  await expect.poll(readImageWidth).toBe(imageFixtureWidth);
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
}

test('Listbox image explorer updates its selected preview', verifiesImageExplorer);
