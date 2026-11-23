import { readFile } from 'node:fs/promises';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Box as BoxExport } from '../../src';

const serverEntry = '../../dist/server/index.js';
const { Box } = (await import(serverEntry)) as { Box: typeof BoxExport };
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const contractCss = await readFile(
  new URL('../../.storybook/box-contract.css', import.meta.url),
  'utf8',
);

/** Mark a native Box so reactive styling must preserve its DOM identity. */
function markConditionalBox(element: Element): void {
  element.setAttribute('data-box-node', 'true');
}

/** Render semantic Box elements and native attributes through the server entry. */
function renderServerBox(): JSX.Element {
  return [
    createComponent(Box, {
      as: 'article' as const,
      id: 'server-box',
      class: 'consumer-box',
      translate: 'no' as const,
      'aria-label': 'Server Box',
      children: 'Server content',
    }),
    createComponent(Box, {
      as: 'img' as const,
      id: 'server-image-box',
      width: 40,
      height: 20,
      style: { width: '10px' },
      alt: 'Server image',
      src: 'data:,',
    }),
  ];
}

/** Render a plain native Box without a provider or component style props. */
function renderPlainServerBox(): JSX.Element {
  return createComponent(Box, {
    as: 'article' as const,
    id: 'plain-server-box',
    class: 'consumer-plain-box',
    style: { color: 'rgb(1, 2, 3)' },
    children: 'CSS-first Box',
  });
}

/** Verify styles, native props, refs, polymorphism, and reactive changes in Chromium. */
async function verifiesBoxContract({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-box--contract');

  const box = page.getByTestId('styled-box');
  const link = page.getByTestId('child-box');
  await expect(box).toBeVisible({ timeout: 30_000 });
  await expect(box).toHaveJSProperty('tagName', 'SECTION');
  await expect(box).toHaveAttribute('data-ref-tag', 'section');
  await expect(box).toHaveAttribute('aria-label', 'Box contract');
  await expect(box).toHaveClass(/leverui-box/);
  await expect(box).toHaveClass('leverui-box consumer-box');
  await expect(box).toHaveCSS('padding', '8px');
  await expect(box).toHaveCSS('background-color', 'rgb(239, 68, 68)');
  await expect(box).toHaveCSS('border-top-width', '1px');
  await expect(box).toHaveCSS('border-top-color', 'rgb(34, 197, 94)');
  await expect(box).not.toHaveCSS('box-shadow', 'none');
  await expect(box).not.toHaveAttribute('bg');
  await expect(box).not.toHaveAttribute('p');
  await expect(page.getByTestId('hide-below-box')).toBeHidden();
  await expect(page.getByTestId('hide-from-box')).toBeVisible();
  const conditional = page.getByTestId('conditional-box');
  await expect(conditional).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await conditional.evaluate(markConditionalBox);

  await box.hover();
  await expect(box).toHaveCSS('background-color', 'rgb(34, 197, 94)');
  await page.mouse.move(0, 0);
  await expect(box).toHaveCSS('background-color', 'rgb(239, 68, 68)');

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(box).toHaveCSS('padding', '16px');
  await expect(page.getByTestId('hide-below-box')).toBeVisible();
  await expect(page.getByTestId('hide-from-box')).toBeHidden();
  await expect(link).toHaveJSProperty('tagName', 'A');
  await expect(link).toHaveAttribute('href', '#box-target');
  await expect(link).toHaveAttribute('aria-label', 'Inactive link');
  await expect(link).toHaveAttribute('data-parent-ref-tag', 'a');
  await expect(link).toHaveAttribute('data-child-ref-tag', 'a');
  await expect(link).toHaveClass(/child-link/);
  await expect(link).toHaveCSS('padding', '8px');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('box-clicks')).toHaveText('1');
  await link.click();
  await expect(page.getByTestId('box-clicks')).toHaveText('2');

  const nativeImage = page.getByTestId('native-image-box');
  await expect(nativeImage).toHaveAttribute('width', '40');
  await expect(nativeImage).toHaveAttribute('height', '20');
  await expect(nativeImage).toHaveCSS('width', '10px');
  await expect(page.getByRole('textbox', { name: 'Native size input' })).toHaveAttribute(
    'size',
    '5',
  );
  await expect(page.getByTestId('svg-box')).toHaveJSProperty('tagName', 'svg');
  await expect(page.getByTestId('svg-box')).toHaveAttribute('data-ref-tag', 'svg');
  await expect(page.getByTestId('svg-box')).toHaveClass('leverui-box');
  await expect(page.getByTestId('svg-box').locator('circle')).toHaveCount(1);

  await page.getByTestId('box-toggle').click();
  await expect(conditional).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  await expect(conditional).toHaveAttribute('data-box-node', 'true');
  await expect(box).toHaveClass('leverui-box consumer-box active-box');
  await expect(box).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  await expect(box).toHaveAttribute('data-ref-tag', 'section');
  await expect(link).toHaveCSS('padding', '16px');
  await expect(link).toHaveAttribute('aria-label', 'Active link');
  await expect(link).toHaveAttribute('data-parent-ref-tag', 'a');
  await expect(nativeImage).toHaveAttribute('width', '80');
}

/** Verify semantic server markup and responsive consumer CSS without JavaScript. */
async function verifiesServerBox({ browser }: { browser: Browser }): Promise<void> {
  const markup = renderToString(renderServerBox);
  expect(markup).toContain('<article');
  expect(markup).toContain('aria-label="Server Box"');
  expect(markup).toContain('translate="no"');
  expect(markup).toContain('width="40"');
  expect(markup).toContain('height="20"');
  expect(markup).toContain('Server content');
  expect(markup).toMatch(/class="leverui-box consumer-box\s*"/);

  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.setViewportSize({ width: 600, height: 700 });
    await page.setContent(`<style>${defaultCss}</style><style>${contractCss}</style>${markup}`);
    const box = page.locator('#server-box');
    await expect(box).toHaveCSS('padding', '8px');
    await expect(box).toHaveCSS('background-color', 'rgb(239, 68, 68)');
    await expect(page.locator('#server-image-box')).toHaveCSS('width', '10px');
    await page.setViewportSize({ width: 900, height: 700 });
    await expect(box).toHaveCSS('padding', '16px');
  } finally {
    await context.close();
  }
}

test('Box preserves native, CSS, polymorphic, and reactive behavior', verifiesBoxContract);
test('Box renders responsive consumer CSS and native attributes on the server', verifiesServerBox);

/** Verify a plain Box needs no component style tag before browser JavaScript runs. */
async function verifiesPlainBoxCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainServerBox);
  expect(markup).toMatch(/class="leverui-box consumer-plain-box\b/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-plain-box{--lui-colors-bg-panel:rgb(12,34,56);background:var(--lui-colors-bg-panel);padding:12px}</style>${markup}`,
  );
  const box = page.locator('#plain-server-box');
  await expect(box).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(box).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await expect(box).toHaveCSS('padding', '12px');
  await expect(box).toHaveCSS('color', 'rgb(1, 2, 3)');
}

test(
  'plain Box renders with authored and consumer CSS without component JavaScript',
  verifiesPlainBoxCss,
);
