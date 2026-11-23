import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Image as ImageExport } from '../../src';

type ServerExports = {
  Image: typeof ImageExport;
};

const serverEntry = '../../dist/server/index.js';
const { Image } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/%3E';

/** Require a rendered image rectangle before comparing dimensions. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected image layout box is absent.');
  return box;
}

/** Verify native image props, styling aliases, refs, and reactive updates. */
async function verifiesImageContract({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-image--contract');
  const image = page.getByTestId('image-default');
  await expect(image).toBeVisible({ timeout: 30_000 });
  await expect(image).toHaveJSProperty('tagName', 'IMG');
  await expect(image).toHaveAttribute('alt', 'Two color image');
  await expect(image).toHaveAttribute('loading', 'lazy');
  await expect(image).toHaveAttribute('decoding', 'async');
  await expect(image).toHaveAttribute('width', '200');
  await expect(image).toHaveAttribute('height', '100');
  await expect(image).not.toHaveAttribute('htmlWidth');
  await expect(image).toHaveClass(/leverui-image/);
  await expect(image).toHaveClass(/consumer-image/);
  await expect(image).toHaveClass(/named-image/);
  await expect(image).toHaveAttribute('data-image-ref', 'img');
  await expect(image).toHaveCSS('object-fit', 'cover');
  await expect(image).toHaveCSS('width', '120px');
  await expect(image).toHaveCSS('height', '120px');
  await expect(image).toHaveJSProperty('naturalWidth', 200);
  await expect(page.getByTestId('image-loads')).not.toHaveText('0');

  const fitted = page.getByTestId('image-fit');
  await expect(fitted).toHaveCSS('object-fit', 'contain');
  await expect(fitted).toHaveCSS('object-position', '0% 0%');
  const responsiveFit = page.getByTestId('image-responsive-fit');
  await expect(responsiveFit).toHaveCSS('object-fit', 'cover');
  await expect(responsiveFit).toHaveCSS('object-position', '0% 0%');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(fitted).toHaveCSS('object-position', '0% 0%');
  await expect(responsiveFit).toHaveCSS('object-position', '100% 100%');
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(page.getByTestId('image-unstyled')).toHaveCSS('object-fit', 'fill');
  await expect(page.getByTestId('image-direct-fit')).toHaveCSS('object-fit', 'fill');
  const circular = await requiredBox(page.getByTestId('image-circular'));
  expect(Math.abs(circular.width - circular.height)).toBeLessThan(1);
  await expect(page.getByTestId('image-circular')).toHaveCSS('border-radius', '9999px');
  const aspect = await requiredBox(page.getByTestId('image-aspect'));
  expect(Math.abs(aspect.width - aspect.height)).toBeLessThan(1);

  const child = page.getByTestId('image-child');
  await expect(child).toHaveJSProperty('tagName', 'IMG');
  await expect(child).toHaveAttribute('alt', 'Child image');
  await expect(child).toHaveAttribute('data-parent-image-ref', 'img');
  await expect(child).toHaveAttribute('data-child-image-ref', 'img');
  await expect(child).toHaveClass(/leverui-image/);
  await expect(child).toHaveClass(/child-image/);
  await expect(child).toHaveCSS('object-fit', 'contain');
  await expect(child).toHaveCSS('width', '90px');
  await child.evaluate(
    /** Mark the native child before a style-only update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );

  const link = page.getByTestId('image-link');
  await expect(link).toHaveJSProperty('tagName', 'A');
  await expect(link).toHaveAttribute('href', '#image-target');
  await link.click();
  await expect(page).toHaveURL(/#image-target$/);

  await page.getByTestId('image-toggle').click();
  await expect(fitted).toHaveCSS('object-fit', 'fill');
  await expect(fitted).toHaveCSS('object-position', '100% 100%');
  await expect(child).toHaveCSS('width', '130px');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await expect(image).toHaveAttribute('data-image-ref', 'img');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.getByTestId('image-responsive')).toHaveCSS('width', '180px');
  await expect(responsiveFit).toHaveCSS('object-fit', 'contain');
  await expect(responsiveFit).toHaveCSS('object-position', '100% 100%');
  await page.addStyleTag({
    content: '.consumer-image { --lui-image-fit: contain; }',
  });
  await expect(image).toHaveCSS('object-fit', 'contain');
}

/** Render Image through the published server entry without a browser DOM. */
function renderServerImage(): JSX.Element {
  return createComponent(Image, {
    id: 'server-image',
    src: imageSource,
    alt: 'Server image',
    fit: 'contain' as const,
    align: 'left top' as const,
    htmlWidth: 200,
    htmlHeight: 100,
    class: 'server-image-width',
  });
}

/** Verify published markup, native aliases, and responsive server CSS. */
async function verifiesServerImage({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerImage);
  expect(markup).toContain('<img');
  expect(markup).toContain('alt="Server image"');
  expect(markup).toContain('width="200"');
  expect(markup).toContain('height="100"');
  expect(markup).toContain('leverui-image');
  expect(markup).not.toMatch(/<img[^>]*\s(?:fit|align|htmlWidth|htmlHeight)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.server-image-width { width: 100px; } @media (min-width: 48rem) { .server-image-width { width: 180px; } }</style>${markup}`,
  );
  const image = page.locator('#server-image');
  await expect(image).toHaveCSS('object-fit', 'contain');
  await expect(image).toHaveCSS('object-position', '0% 0%');
  await expect(image).toHaveCSS('width', '100px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(image).toHaveCSS('width', '180px');
}

test('Image preserves native rendering, styles, and Solid composition', verifiesImageContract);
test('published Image preserves markup and responsive styles', verifiesServerImage);
