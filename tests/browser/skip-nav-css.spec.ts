import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { SkipNavContent as ContentExport, SkipNavLink as LinkExport } from '../../src';

type ServerExports = {
  SkipNavContent: typeof ContentExport;
  SkipNavLink: typeof LinkExport;
};

const serverEntry = '../../dist/server/index.js';
const { SkipNavContent, SkipNavLink } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render default, consumer-styled, and unstyled pairs without client scripts. */
function renderSkipNavExamples(): string {
  return renderToString(
    /** Render native pairs without a styling provider. */
    () => [
      createComponent(SkipNavLink, { id: 'default-main', children: 'Default skip' }),
      createComponent(SkipNavContent, {
        id: 'default-main',
        children: 'Default destination',
      }),
      createComponent(SkipNavLink, {
        id: 'consumer-main',
        class: 'consumer-skip',
        children: 'Consumer skip',
      }),
      createComponent(SkipNavContent, {
        id: 'consumer-main',
        class: 'consumer-destination',
        children: 'Consumer destination',
      }),
      createComponent(SkipNavLink, {
        id: 'unstyled-main',
        unstyled: true,
        children: 'Unstyled skip',
      }),
      createComponent(SkipNavLink, {
        id: 'native-style-main',
        style: { top: '12px' },
        children: 'Native style skip',
      }),
      createComponent(SkipNavLink, {
        id: 'unstyled-native-main',
        unstyled: true,
        style: 'position:relative',
        children: 'Unstyled native skip',
      }),
    ],
  );
}

/** Verify the stylesheet owns defaults and consumer CSS wins without scripts. */
async function verifiesSkipNavCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  const markup = renderSkipNavExamples();
  expect(markup).not.toMatch(/style="[^"]*outline/);
  const consumerCss = String.raw`:root { --leverui-spacing-2\.5: 1.5rem; } .consumer-skip { top: 18px; } .consumer-destination { outline: 1px solid red; }`;
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);
  const defaultLink = page.locator('a[href="#default-main"]');
  await expect(defaultLink).toHaveCSS('position', 'absolute');
  await expect(defaultLink).toHaveCSS('clip', 'rect(0px, 0px, 0px, 0px)');
  await expect(defaultLink).toHaveCSS('font-size', '14px');
  await expect(defaultLink).toHaveCSS('padding-top', '24px');
  await expect(page.locator('a[href="#consumer-main"]')).toHaveCSS('top', '18px');
  await expect(page.locator('#default-main')).toHaveCSS('outline-style', 'none');
  await expect(page.locator('#consumer-main')).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('a[href="#unstyled-main"]')).toHaveCSS('position', 'static');
  await expect(page.locator('a[href="#native-style-main"]')).toHaveCSS('top', '12px');
  await expect(page.locator('a[href="#unstyled-native-main"]')).toHaveCSS('position', 'relative');
  await expect(defaultLink).toHaveClass(/leverui-skip-nav/);
  await expect(page.locator('#default-main')).toHaveClass(/leverui-skip-nav-content/);
}

test('Skip Nav defaults and consumer overrides work without scripts', verifiesSkipNavCss);
