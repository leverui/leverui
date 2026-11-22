import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Field as FieldExport, FileUpload as FileUploadExport } from '../src';

export interface FileUploadHydrationComponents {
  Field: typeof FieldExport;
  FileUpload: typeof FileUploadExport;
}

/** Build one public file input tree for published SSR and client hydration. */
export function renderFileUploadHydrationTree({
  Field,
  FileUpload,
}: FileUploadHydrationComponents): JSX.Element {
  return createComponent(Field.Root, {
    id: 'hydrated-attachment-field',
    /** Associate field guidance and validation with the file input. */
    get children() {
      return [
        createComponent(Field.Label, { children: 'Attachment' }),
        createComponent(FileUpload.Root, {
          id: 'hydrated-attachment',
          name: 'attachment',
          'data-testid': 'hydrated-file-upload-root',
          /** Retain machine-owned descendants across hydration. */
          get children() {
            return [
              createComponent(FileUpload.Label, { children: 'Choose attachment' }),
              createComponent(FileUpload.HiddenInput, {}),
              createComponent(FileUpload.Trigger, { children: 'Browse' }),
              createComponent(FileUpload.FileText, {
                id: 'hydrated-file-upload-text',
              }),
              createComponent(FileUpload.List, {}),
            ];
          },
        }),
        createComponent(Field.HelperText, { children: 'Select a text file' }),
      ];
    },
  });
}
