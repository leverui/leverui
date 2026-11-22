import assert from 'node:assert/strict';
import { ColorPicker, ColorPickerRoot, parseColor } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render named and compound color controls through the installed Node entry. */
function renderPackedColorPicker() {
  return renderToString(
    /** Establish the package's style context around both machines. */
    () => [
      createComponent(ColorPicker.Root, {
        defaultValue: parseColor('#eb5e41'),
        /** Render machine label, control, input, and trigger. */
        get children() {
          return [
            createComponent(ColorPicker.Label, { children: 'Packed color' }),
            createComponent(ColorPicker.Control, {
              /** Keep native controls under the color machine. */
              get children() {
                return [
                  createComponent(ColorPicker.Input, {}),
                  createComponent(ColorPicker.Trigger, {}),
                ];
              },
            }),
          ];
        },
      }),
      createComponent(ColorPickerRoot, {
        defaultValue: parseColor('#123456'),
        /** Show a named root with a compound current-value part. */
        get children() {
          return createComponent(ColorPicker.ValueSwatch, {});
        },
      }),
    ],
  );
}

const markup = renderPackedColorPicker();
assert.match(markup, /leverui-color-picker__root/);
assert.match(markup, /leverui-color-picker__trigger/);
assert.match(markup, /Packed color/);
assert.match(markup, /#EB5E41/);
