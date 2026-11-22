import assert from 'node:assert/strict';
import { ColorSwatch, ColorSwatchMix } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Color Swatch from the isolated installed package. */
function renderInstalledSwatch() {
  return [
    createComponent(ColorSwatch, { value: 'red', id: 'packed-server-swatch' }),
    createComponent(ColorSwatchMix, {
      items: ['red', 'blue'],
      id: 'packed-server-mix',
    }),
  ];
}

const markup = renderToString(renderInstalledSwatch);
assert.match(markup, /<span[^>]*id="packed-server-swatch"/);
assert.match(markup, /data-value="transparent"/);
assert.match(markup, /leverui-color-swatch/);
assert.doesNotMatch(markup, /\s(?:items|size|shape)=/);
console.log('Packed Color Swatch server rendering passed.');
