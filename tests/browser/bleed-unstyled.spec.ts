import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Bleed as BleedExport } from '../../src';

type ServerExports = {
  Bleed: typeof BleedExport;
};

const serverEntry = '../../dist/server/index.js';
const { Bleed } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render explicitly requested Bleed spacing with unstyled roots. */
function renderUnstyledBleeds(): string {
  return renderToString(
    /** Render separate roots to check each logical edge. */
    () => [
      createComponent(Bleed, {
        id: 'native-unstyled-bleed',
        unstyled: true,
        inline: '4',
        children: 'Native bleed',
      }),
      createComponent(Bleed, {
        id: 'styled-unstyled-bleed',
        unstyled: true,
        blockEnd: '4',
        style: 'position:relative',
        children: 'Styled bleed',
      }),
    ],
  );
}

/** Keep explicitly requested negative margins when defaults are unstyled. */
async function verifiesUnstyledBleed({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${renderUnstyledBleeds()}`);
  const native = page.locator('#native-unstyled-bleed');
  const styled = page.locator('#styled-unstyled-bleed');
  await expect(native).toHaveCSS('margin-inline-start', '-16px');
  await expect(styled).toHaveCSS('margin-block-end', '-16px');
  await expect(styled).toHaveCSS('position', 'relative');
}

test('explicit Bleed spacing survives unstyled composition', verifiesUnstyledBleed);
