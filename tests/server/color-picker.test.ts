import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { ColorPicker as ColorPickerExport } from '../../src';

type ServerComponents = {
  ColorPicker: typeof ColorPickerExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render public ColorPicker parts from the package's server entry. */
function renderServerColorPicker(): string {
  return renderToString(
    /** Construct the machine without a styling provider. */
    () =>
      createComponent(server.ColorPicker.Root, {
        defaultValue: server.ColorPicker.parseColor('#eb5e41'),
        /** Exercise the public control and current swatch. */
        get children() {
          return [
            createComponent(server.ColorPicker.Label, { children: 'Color' }),
            createComponent(server.ColorPicker.Control, {
              /** Keep native input and trigger under the same machine. */
              get children() {
                return [
                  createComponent(server.ColorPicker.Input, {}),
                  createComponent(server.ColorPicker.Trigger, {}),
                ];
              },
            }),
            createComponent(server.ColorPicker.HiddenInput, {}),
          ];
        },
      }),
  );
}

/** Verify server markup contains accessible, styled compound parts. */
function verifiesServerMarkup(): void {
  const markup = renderServerColorPicker();
  expect(markup).toContain('lui-color-picker__root');
  expect(markup).toContain('lui-color-picker__label');
  expect(markup).toContain('lui-color-picker__control');
  expect(markup).toContain('lui-color-picker__channelInput');
  expect(markup).toContain('lui-color-picker__trigger');
  expect(markup).toContain('lui-color-picker__swatch');
  expect(markup).toContain('data-lui-color-picker-css');
  expect(markup).toContain('tabIndex="-1"');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|onValueChange)=/);
}

test('published ColorPicker renders compound controls on the server', verifiesServerMarkup);
