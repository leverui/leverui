import assert from 'node:assert/strict';
import { FileUpload } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed File Upload through its published server entry. */
function renderInstalledFileUpload() {
  return renderToString(
    /** Construct the primitive machine with packaged CSS. */
    () =>
      createComponent(FileUpload.Root, {
        id: 'packed-server-files',
        required: true,
        /** Render the associated label, input, and dropzone. */
        get children() {
          return [
            createComponent(FileUpload.Label, { children: 'Documents' }),
            createComponent(FileUpload.HiddenInput, { name: 'documents' }),
            createComponent(FileUpload.Trigger, { children: 'Choose documents' }),
            createComponent(FileUpload.Dropzone, { children: 'Drop documents' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledFileUpload();
assert.match(markup, /type="file"/);
assert.match(markup, /name="documents"/);
assert.match(markup, /leverui-file-upload__root/);
assert.match(markup, /leverui-file-upload__dropzone/);
assert.match(markup, /leverui-file-upload__hiddenInput/);
assert.match(markup, /required/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|maxFiles)=/);
console.log('Packed File Upload server rendering passed.');
