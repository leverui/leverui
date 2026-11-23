import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  ColorModeScript as ColorModeScriptExport,
  getColorModeScript as getColorModeScriptExport,
} from '../../src';

type ServerExports = {
  ColorModeScript: typeof ColorModeScriptExport;
  getColorModeScript: typeof getColorModeScriptExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Verify the published server entry writes the script into the page unescaped. */
function verifiesServerColorModeScript(): void {
  const markup = renderToString(
    /** Render the script as a document head would. */
    () => createComponent(server.ColorModeScript, { defaultMode: 'dark', nonce: 'abc123' }),
  );
  // The server adds its own hydration marker to the tag, so match the nonce anywhere in it.
  expect(markup).toMatch(/^<script[^>]* nonce="abc123"[^>]*>/);
  expect(markup.endsWith('</script>')).toBe(true);
  expect(markup).toContain(server.getColorModeScript({ defaultMode: 'dark' }));
  expect(markup).toContain("localStorage.getItem('leverui-color-mode')");
  expect(markup).toContain("root.setAttribute('data-lui-color-mode', mode)");
}

test('published ColorModeScript renders its script on the server', verifiesServerColorModeScript);
