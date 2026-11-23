import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { ColorSwatch as SwatchExport, ColorSwatchMix as MixExport } from '../../src';

interface ServerComponents {
  ColorSwatch: typeof SwatchExport;
  ColorSwatchMix: typeof MixExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Verify the published server entry renders swatch values and mixed cells. */
function verifiesServerSwatches(): void {
  const markup = renderToString(
    /** Build both public swatches without a styling provider. */
    () => [
      createComponent(server.ColorSwatch, { value: 'red', id: 'server-swatch' }),
      createComponent(server.ColorSwatchMix, {
        items: ['red', 'blue'],
        id: 'server-mix',
      }),
    ],
  );

  expect(markup).toMatch(/<span[^>]*id="server-swatch"/);
  expect(markup).toContain('data-value="red"');
  expect(markup).toContain('data-value="transparent"');
  expect(markup).toContain('lui-color-swatch');
  expect(markup).not.toMatch(/\s(?:items|size|shape)=/);
}

test('published Color Swatch renders native server markup', verifiesServerSwatches);
