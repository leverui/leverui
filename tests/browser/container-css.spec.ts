import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Container as ContainerExport } from '../../src';

type ServerExports = {
  Container: typeof ContainerExport;
};

const serverEntry = '../../dist/server/index.js';
const { Container } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render default, responsive, and unstyled Container variants on the server. */
function renderPlainContainers(): JSX.Element {
  return [
    createComponent(Container, {
      id: 'plain-container',
      class: 'consumer-container',
      children: 'Plain',
    }),
    createComponent(Container, {
      id: 'responsive-container',
      centerContent: { base: true, md: false, lg: true },
      fluid: { base: true, md: false, lg: true },
      children: 'Responsive',
    }),
    createComponent(Container, { id: 'unstyled-container', unstyled: true, children: 'Plain' }),
  ];
}

/** Verify finite variants and CSS overrides without browser JavaScript. */
async function verifiesContainerCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainContainers);
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const plain = page.locator('#plain-container');
  const responsive = page.locator('#responsive-container');
  await expect(plain).not.toHaveAttribute('data-lui-private-style-runtime', '');
  await expect(plain).toHaveCSS('position', 'relative');
  await expect(plain).toHaveCSS('max-width', '1440px');
  await expect(plain).toHaveCSS('padding-left', '16px');
  await expect(responsive).toHaveCSS('display', 'flex');
  await expect(responsive).toHaveCSS('max-width', '100%');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(plain).toHaveCSS('padding-left', '24px');
  await expect(responsive).toHaveAttribute('data-center-content-md', 'true');
  await expect(responsive).toHaveAttribute('data-fluid-md', 'true');
  await expect(responsive).toHaveCSS('display', 'flex');
  await expect(responsive).toHaveCSS('align-items', 'center');
  await expect(responsive).toHaveCSS('max-width', '100%');
  await page.setViewportSize({ width: 1700, height: 800 });
  await expect(plain).toHaveCSS('padding-left', '32px');
  await expect(responsive).toHaveCSS('display', 'flex');
  await expect(responsive).toHaveCSS('align-items', 'center');
  await expect(responsive).toHaveCSS('max-width', '100%');
  await expect(page.locator('#unstyled-container')).toHaveCSS('position', 'static');
  await page.addStyleTag({ content: ':root { --lui-sizes-full: 90%; }' });
  await expect(responsive).toHaveCSS('max-width', '90%');
  await page.addStyleTag({ content: ':root { --lui-sizes-8xl: 80rem; }' });
  await expect(plain).toHaveCSS('max-width', '1280px');
  await page.addStyleTag({
    content: '.consumer-container { max-width: 60rem; padding-inline: 3rem; }',
  });
  await expect(plain).toHaveCSS('max-width', '960px');
  await expect(plain).toHaveCSS('padding-left', '48px');
}

test('Container finite variants use authored CSS before hydration', verifiesContainerCss);
