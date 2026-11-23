import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { AvatarFallback as FallbackExport, AvatarRoot as RootExport } from '../../src';

type ServerExports = {
  AvatarFallback: typeof FallbackExport;
  AvatarRoot: typeof RootExport;
};

const serverEntry = '../../dist/server/index.js';
const { AvatarFallback, AvatarRoot } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify fallback, image status, reactive defaults, and group layout in Chromium. */
async function verifiesAvatarBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-avatar--contract');
  const root = page.getByTestId('avatar-root');
  const fallback = page.getByTestId('avatar-fallback');
  const image = page.getByTestId('avatar-image');
  await expect(fallback).toHaveText('AL', { timeout: 30_000 });
  await expect(root).toHaveAttribute('data-avatar-root');
  await expect(root).toHaveAttribute('data-ref-tag', 'div');
  await expect(root).toHaveCSS('width', '36px');
  await expect(image).toHaveAttribute('draggable', 'false');
  await expect(image).toHaveAttribute('referrerpolicy', 'no-referrer');
  await expect(page.getByTestId('avatar-status')).toHaveText('error');
  await expect(page.getByTestId('avatar-icon-fallback').locator('svg')).toHaveCount(1);
  await expect(page.getByTestId('avatar-custom-fallback')).toHaveText('Custom');
  await expect(page.getByTestId('avatar-empty-child-fallback')).toHaveText('AL');
  await expect(page.getByTestId('avatar-external-root')).toHaveAttribute('data-avatar-root');
  await expect(page.getByTestId('avatar-child-root')).toHaveJSProperty('tagName', 'SECTION');
  await expect(page.getByTestId('avatar-child-root')).toHaveAttribute('data-avatar-root');
  await expect(page.getByTestId('avatar-child-fallback')).toHaveText('Child fallback');

  await page.getByTestId('avatar-name-toggle').click();
  await expect(fallback).toHaveText('GH');
  await page.getByTestId('avatar-size-toggle').click();
  await expect(root).toHaveCSS('width', '44px');
  await page.getByTestId('avatar-image-toggle').click();
  await expect(image).toBeVisible();
  await expect(page.getByTestId('avatar-status')).toHaveText('loaded');
  await expect(image).toHaveAttribute('alt', 'Grace Hopper');
  await expect(image).toHaveClass(/lui-avatar__image/);
  await expect(image).toHaveCSS('object-fit', 'cover');
  await page.addStyleTag({ content: '.lui-avatar__image { object-fit: contain; }' });
  await expect(image).toHaveCSS('object-fit', 'contain');
  const group = page.getByTestId('avatar-group');
  await expect(group).toHaveCSS('gap', '0px');
  await expect(page.getByTestId('avatar-group-first')).toHaveAttribute('data-lui-group-item', '');
  await expect(page.getByTestId('avatar-group-last')).toHaveCSS('width', '32px');
}

/** Render the published Avatar with initials and styling on the server. */
function renderServerAvatar(): JSX.Element {
  return createComponent(AvatarRoot, {
    id: 'server-avatar',
    size: 'lg' as const,
    variant: 'outline' as const,
    /** Create the fallback inside the primitive's machine context. */
    get children() {
      return createComponent(AvatarFallback, { name: 'Grace Hopper' });
    },
  });
}

/** Verify server markup and authored CSS geometry from the published entry. */
async function verifiesServerAvatar({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerAvatar);
  expect(markup).toContain('GH');
  expect(markup).toContain('data-avatar-');
  expect(markup).toContain('lui-avatar__root');
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('data-variant="outline"');
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|variant|recipe)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('[data-avatar-root]')).toHaveCSS('width', '44px');
}

test(
  'Avatar preserves the primitive status and Lever UI slots in the browser',
  verifiesAvatarBrowserContract,
);
test('published Avatar renders initials and CSS styling on the server', verifiesServerAvatar);
