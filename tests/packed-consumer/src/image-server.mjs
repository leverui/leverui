import assert from 'node:assert/strict';
import { Image } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Image with packaged CSS. */
function renderInstalledImage() {
  return renderToString(
    /** Keep image attributes under Solid's server owner. */
    () =>
      createComponent(Image, {
        id: 'packed-server-image',
        src: 'data:,',
        alt: 'Installed server image',
        fit: 'contain',
        align: 'left top',
        htmlWidth: 200,
        htmlHeight: 100,
      }),
  );
}

const markup = renderInstalledImage();
assert.match(markup, /<img/);
assert.match(markup, /alt="Installed server image"/);
assert.match(markup, /width="200"/);
assert.match(markup, /height="100"/);
assert.match(markup, /leverui-image/);
assert.match(markup, /data-fit-base="contain"/);
assert.match(markup, /--lui-private-image-align-base:left top/);
assert.doesNotMatch(markup, /\s(?:fit|align|htmlWidth|htmlHeight)=/);
console.log('Packed Image server rendering passed.');
