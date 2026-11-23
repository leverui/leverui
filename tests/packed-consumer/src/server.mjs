import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Box, Button, Theme } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Build the server tree using only the installed package. */
function renderPackedConsumer() {
  return [
    createComponent(Box, {
      id: 'packed-box',
      class: 'packed-box-surface',
      children: 'Packed Box',
    }),
    createComponent(Box, {
      id: 'native-props-box',
      part: 'notice',
      textContent: 'Native text',
      children: 'Replaced child',
    }),
    createComponent(Theme, {
      appearance: 'dark',
      /** Render a CSS-backed child in the dark scope. */
      get children() {
        return createComponent(Button, {
          id: 'packed-button',
          colorPalette: 'blue',
          children: 'Packed Button',
        });
      },
    }),
  ];
}

const html = renderToString(renderPackedConsumer);
assert.match(html, /Packed Box/);
assert.match(html, /id="native-props-box"/);
assert.match(html, /part="notice"/);
assert.match(html, />Native text<\/div>/);
assert.doesNotMatch(html, /Replaced child/);
assert.match(html, /Packed Button/);
assert.match(html, /data-leverui-color-mode="dark"/);
assert.match(html, /leverui-button/);
assert.match(html, /id="packed-button"[^>]*data-size="md"/);
assert.match(html, /id="packed-button"[^>]*data-variant="solid"/);
assert.match(html, /id="packed-button"[^>]*data-leverui-color-palette="blue"/);

/** Render a named consumer class and a CSS-customized Button without a provider. */
function renderConsumerCss() {
  return [
    createComponent(Box, {
      id: 'custom-utility-box',
      class: 'consumer-brand-space',
      children: 'Custom spacing',
    }),
    createComponent(Button, {
      class: 'consumer-brand-button',
      children: 'Custom Button',
    }),
  ];
}

const consumerHtml = renderToString(renderConsumerCss);
assert.match(consumerHtml, /consumer-brand-button/);
assert.match(consumerHtml, /id="custom-utility-box"[^>]*consumer-brand-space/);
assert.doesNotMatch(consumerHtml, /brandSpace="compact"/);

const packageCss = readFileSync(
  new URL(import.meta.resolve('@leverui/components/styles.css')),
  'utf8',
);
const consumerCss = readFileSync(new URL('./consumer-system.css', import.meta.url), 'utf8');
assert.match(packageCss, /\.leverui-button/);
assert.match(consumerCss, /\.consumer-brand-space/);
assert.match(consumerCss, /--lui-colors-blue-solid/);

/** Keep native button type separate from CSS appearance selection. */
function renderNativeTypeButton() {
  return createComponent(Button, {
    type: 'submit',
    class: 'consumer-brand-button',
    children: 'Submit',
  });
}

const nativeTypeHtml = renderToString(renderNativeTypeButton);
assert.match(nativeTypeHtml, /type="submit"/);
assert.match(nativeTypeHtml, /consumer-brand-button/);
assert.doesNotMatch(nativeTypeHtml, /chartreuse/);
console.log('Packed consumer CSS and SSR passed.');
