import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { VisuallyHidden as HiddenExport } from '../../src';

type ServerExports = {
  VisuallyHidden: typeof HiddenExport;
};

const serverEntry = '../../dist/server/index.js';
const { VisuallyHidden } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render default, consumer-styled, and unstyled roots without client scripts. */
function renderHiddenExamples(): string {
  return renderToString(
    /** Render independent native roots without a styling provider. */
    () => [
      createComponent(VisuallyHidden, {
        id: 'default-hidden',
        children: 'Accessible label',
      }),
      createComponent(VisuallyHidden, {
        id: 'consumer-hidden',
        class: 'consumer-hidden',
        children: 'Consumer label',
      }),
      createComponent(VisuallyHidden, {
        id: 'unstyled-hidden',
        unstyled: true,
        children: 'Visible label',
      }),
      createComponent(VisuallyHidden, {
        id: 'native-style-hidden',
        style: { width: '2px' },
        children: 'Native style label',
      }),
    ],
  );
}

/** Check accessible clipping, consumer CSS, and unstyled behavior without scripts. */
async function verifiesHiddenCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  const markup = renderHiddenExamples();
  expect(markup).not.toMatch(/id="default-hidden"[^>]*style="[^"]*clip/);
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-hidden { width: 5px; }</style>${markup}`,
  );
  const defaultHidden = page.locator('#default-hidden');
  await expect(defaultHidden).toHaveCSS('position', 'absolute');
  await expect(defaultHidden).toHaveCSS('clip', 'rect(0px, 0px, 0px, 0px)');
  await expect(defaultHidden).toHaveCSS('width', '1px');
  await expect(defaultHidden).not.toHaveAttribute('aria-hidden');
  await expect(page.locator('#consumer-hidden')).toHaveCSS('width', '5px');
  await expect(page.locator('#unstyled-hidden')).toHaveCSS('position', 'static');
  await expect(page.locator('#native-style-hidden')).toHaveCSS('width', '2px');
}

test('VisuallyHidden defaults and overrides work without scripts', verifiesHiddenCss);
