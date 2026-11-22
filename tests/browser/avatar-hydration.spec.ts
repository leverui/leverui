import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { AvatarHydrationComponents } from '../../.storybook/avatar-hydration-tree';
import { renderAvatarHydrationTree } from '../../.storybook/avatar-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as AvatarHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the shared Avatar tree through Storybook's browser runtime. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/avatar-hydration-example.tsx';
  const { hydrateAvatarExample } = await import(modulePath);
  const target = document.getElementById('avatar-hydration-root');
  if (!target) throw new Error('Avatar hydration root was not found.');
  hydrateAvatarExample(target);
}

/** Verify the same Avatar nodes survive hydration and image loading. */
async function verifiesAvatarHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use only published server exports for the first render. */
    () => renderAvatarHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="avatar-hydration-root">${markup}</div>`,
  );
  // The root's `id` is its machine id, which Zag 2 writes on the scoped part attribute.
  const root = page.locator('[data-avatar-root="hydrated-avatar"]');
  const image = page.locator('#hydrated-avatar-image');
  const fallback = page.locator('#hydrated-avatar-fallback');
  await expect(fallback).toHaveText('AL');
  for (const element of [root, image, fallback]) {
    await element.evaluate(
      /** Mark an original server node before Solid hydrates it. */
      (node) => node.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Capture errors raised by hydration or the later image transition. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#avatar-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const element of [root, image, fallback]) {
    await expect(element).toHaveAttribute('data-server-node', 'true');
  }
  await page.getByTestId('hydrated-avatar-load').click();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src', /^data:image\/svg\+xml,/);
  expect(errors).toEqual([]);
}

test(
  'published Avatar hydrates without replacing parts and loads an image',
  verifiesAvatarHydration,
);
