import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { ImageHydrationComponents } from '../../.storybook/image-hydration-tree';
import { renderImageHydrationTree } from '../../.storybook/image-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ImageHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Image tree to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/image-hydration-example.tsx';
  const { hydrateImageExample } = await import(modulePath);
  const root = document.getElementById('image-hydration-root');
  if (!root) throw new Error('Image hydration root was not found.');
  hydrateImageExample(root);
}

/** Verify Image hydrates in place and updates native and CSS values. */
async function verifiesImageHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through published server exports. */
    () => renderImageHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="image-hydration-root">${markup}</div>`,
  );
  const image = page.locator('#hydrated-image');
  await expect(image).toHaveCSS('object-fit', 'cover');
  await expect(image).toHaveCSS('object-position', '0% 0%');
  await expect(image).toHaveCSS('width', '90px');
  await expect(image).toHaveAttribute('width', '200');
  await image.evaluate(
    /** Mark the server image before Solid hydrates it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser errors while hydration and updates run. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#image-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(image).toHaveAttribute('data-server-node', 'true');

  await page.locator('#hydrated-image-toggle').click();
  await expect(image).toHaveCSS('object-fit', 'contain');
  await expect(image).toHaveCSS('object-position', '100% 100%');
  await expect(image).toHaveCSS('width', '130px');
  await expect(image).toHaveAttribute('width', '250');
  await expect(image).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Image hydrates without replacement and reacts to new props',
  verifiesImageHydration,
);
