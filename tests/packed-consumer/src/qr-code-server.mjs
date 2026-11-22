import assert from 'node:assert/strict';
import { QrCodeFrame, QrCodeRoot } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed QR exports with packaged CSS. */
function renderPackedQrCode() {
  return renderToString(
    /** Mount one QR machine and a default frame path. */
    () =>
      createComponent(QrCodeRoot, {
        id: 'packed-server-qr',
        as: 'section',
        value: 'Packed server QR',
        size: 'lg',
        /** Create the frame inside the primitive's QR context. */
        get children() {
          return createComponent(QrCodeFrame, {
            'aria-label': 'Packed server QR',
            htmlWidth: 96,
            htmlHeight: 96,
          });
        },
      }),
  );
}

const markup = renderPackedQrCode();
assert.match(markup, /data-qr-code-/);
assert.match(markup, /data-size="lg"/);
assert.match(markup, /<section[^>]*data-qr-code-/);
assert.match(markup, /<svg[^>]*data-qr-code-frame/);
assert.match(markup, /<svg[^>]*width="96"/);
assert.match(markup, /<svg[^>]*height="96"/);
assert.doesNotMatch(markup, /htmlWidth|htmlHeight|\sas="section"/);
assert.match(markup, /<path[^>]*d="/);
assert.match(markup, /leverui-qr-code__root/);
assert.doesNotMatch(markup, /<div[^>]*\ssize=/);
