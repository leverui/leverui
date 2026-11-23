import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { FileUpload as FileUploadExport } from '../../src';

type ServerComponents = { FileUpload: typeof FileUploadExport };

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a native file picker through the published server entry. */
function renderServerFileUpload(): string {
  return renderToString(
    /** Construct the primitive machine without a styling provider. */
    () =>
      createComponent(server.FileUpload.Root, {
        id: 'server-files',
        required: true,
        /** Render label, hidden input, trigger, and drop target. */
        get children() {
          return [
            createComponent(server.FileUpload.Label, { children: 'Upload documents' }),
            createComponent(server.FileUpload.HiddenInput, { name: 'documents' }),
            createComponent(server.FileUpload.Trigger, { children: 'Choose files' }),
            createComponent(server.FileUpload.Dropzone, { children: 'Drop files' }),
            createComponent(server.FileUpload.FileText, {}),
          ];
        },
      }),
  );
}

/** Preserve native form controls and stable classes in server markup. */
function verifiesServerFileUpload(): void {
  const markup = renderServerFileUpload();
  expect(markup).toContain('type="file"');
  expect(markup).toContain('name="documents"');
  expect(markup).toContain('required');
  expect(markup).toContain('lui-file-upload__root');
  expect(markup).toContain('lui-file-upload__dropzone');
  expect(markup).toContain('lui-file-upload__hiddenInput');
  expect(markup).toContain('Upload documents');
  expect(markup).toContain('Select file(s)');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|maxFiles)=/);
}

test('published File Upload renders its native form composition', verifiesServerFileUpload);
