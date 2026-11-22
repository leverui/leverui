import assert from 'node:assert/strict';
import { Heading } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Heading without inserting a component style rule. */
function renderHeading() {
  return renderToString(
    /** Keep the component under the public provider. */
    () =>
      createComponent(Heading, {
        as: 'h3',
        size: '4xl',
        id: 'packed-server-heading',
        children: 'Server heading',
      }),
  );
}

const markup = renderHeading();
assert.match(markup, /<h3[^>]*id="packed-server-heading"/);
assert.match(markup, /data-size="4xl"/);
assert.match(markup, /leverui-heading/);

const standalone = renderToString(
  /** Render the same public Heading with packaged CSS. */
  () =>
    createComponent(Heading, {
      as: 'h1',
      size: '2xl',
      id: 'standalone-heading',
      children: 'Standalone heading',
    }),
);
assert.match(standalone, /<h1[^>]*id="standalone-heading"/);
assert.match(standalone, /data-size="2xl"/);
console.log('Packed Heading server rendering passed.');
