import assert from 'node:assert/strict';
import { DownloadTrigger } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed server entry without a browser environment. */
function renderPackedDownloadTrigger() {
  return renderToString(
    /** Render the native button with packaged CSS. */
    () =>
      createComponent(DownloadTrigger, {
        data: 'packed payload',
        fileName: 'packed.txt',
        mimeType: 'text/plain',
        children: 'Save packed file',
      }),
  );
}

const markup = renderPackedDownloadTrigger();
assert.match(markup, /<button[^>]*type="button"/);
assert.match(markup, /Save packed file<\/button>/);
assert.match(markup, /leverui-download-trigger/);
assert.doesNotMatch(markup, /packed payload|packed\.txt|mimeType=/);
