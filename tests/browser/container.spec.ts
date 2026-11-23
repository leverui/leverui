import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Container as ContainerExport } from '../../src';

type ServerExports = {
  Container: typeof ContainerExport;
};

const serverEntry = '../../dist/server/index.js';
const { Container } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a rendered box before checking Container geometry. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Container layout box is absent.');
  return box;
}

/** Accept subpixel browser rounding for a measured dimension. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify default geometry, recipe variants, native paths, and CSS overrides. */
async function verifiesContainer({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=layout-container--contract');
  const story = page.getByTestId('container-story');
  const root = page.getByTestId('container-default');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveCSS('position', 'relative');
  await expect(root).toHaveCSS('max-width', '1440px');
  await expect(root).toHaveCSS('padding-left', '16px');
  await expect(root).toHaveCSS('padding-right', '16px');
  expectNear((await requiredBox(root)).width, (await requiredBox(story)).width);
  await expect(root).toHaveClass(/lui-container/);

  const centered = page.getByTestId('container-centered');
  await expect(centered).toHaveCSS('display', 'flex');
  await expect(centered).toHaveCSS('flex-direction', 'column');
  await expect(centered).toHaveCSS('align-items', 'center');
  await expect(centered).not.toHaveAttribute('centerContent');
  await expect(page.getByTestId('container-fluid')).not.toHaveAttribute('fluid');
  const sized = page.getByTestId('container-sized');
  expectNear((await requiredBox(sized)).width, 384);
  await expect(sized).toHaveCSS('padding-left', '8px');
  await expect(page.getByTestId('container-unstyled')).toHaveCSS('position', 'static');
  await expect(page.getByTestId('container-custom-css')).toHaveCSS('max-width', '500px');

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(root).toHaveCSS('padding-left', '24px');
  expectNear((await requiredBox(sized)).width, 512);

  await page.setViewportSize({ width: 1700, height: 800 });
  await expect(root).toHaveCSS('padding-left', '32px');
  const defaultBox = await requiredBox(root);
  const storyBox = await requiredBox(story);
  expectNear(defaultBox.width, 1440);
  expectNear(defaultBox.x, storyBox.x + (storyBox.width - defaultBox.width) / 2);
  expectNear((await requiredBox(page.getByTestId('container-fluid'))).width, storyBox.width);
  expectNear(
    (await requiredBox(page.getByTestId('container-responsive-fluid'))).width,
    storyBox.width,
  );

  const reactive = page.getByTestId('container-reactive');
  const child = page.getByTestId('container-reactive-child');
  await expect(reactive).toHaveJSProperty('tagName', 'SECTION');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'section');
  expectNear((await requiredBox(reactive)).width, 1440);
  await reactive.evaluate(
    /** Mark the native root to detect replacement after a provider update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the child to detect replacement after a provider update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('container-toggle').click();
  expectNear((await requiredBox(reactive)).width, storyBox.width);
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  expectNear((await requiredBox(page.getByTestId('container-instance-override'))).width, 1440);

  const link = page.getByRole('link', { name: 'Container link' });
  await expect(link).toHaveCSS('position', 'relative');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#container-target$/);

  await page.addStyleTag({ content: ':root { --lui-sizes-8xl: 80rem; }' });
  expectNear((await requiredBox(root)).width, 1280);
}

/** Render a configured Container from the published server entry. */
function renderServerContainer(): JSX.Element {
  return createComponent(Container, {
    id: 'server-container',
    fluid: { base: false, lg: true },
    centerContent: true,
    children: 'Server container',
  });
}

/** Measure server responsive styles and keep variant props out of HTML. */
async function verifiesServerContainer({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerContainer);
  expect(markup).toContain('Server container');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  expect(markup).not.toMatch(/<div[^>]*\s(?:fluid|centerContent)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setViewportSize({ width: 1700, height: 800 });
  /* The library has no page reset, so the page clears the body margin itself. */
  await page.setContent(`<style>${defaultCss} body { margin: 0; }</style>${markup}`);
  const root = page.locator('#server-container');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('align-items', 'center');
  expectNear((await requiredBox(root)).width, 1700);
  await page.setViewportSize({ width: 900, height: 800 });
  expectNear((await requiredBox(root)).width, 900);
  await expect(root).toHaveCSS('max-width', '1440px');
}

test(
  'Container preserves layout, variants, provider defaults, and native behavior',
  verifiesContainer,
);
test('published Container renders responsive variants on the server', verifiesServerContainer);
