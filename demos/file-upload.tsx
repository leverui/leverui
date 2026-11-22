import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  FileUploadAcceptedFiles,
  FileUploadBasic,
  FileUploadDirectory,
  FileUploadMediaCapture,
  FileUploadMultiple,
} from './examples/file-upload-basic-examples';
import {
  FileUploadConditionalDropzone,
  FileUploadDropzone,
  FileUploadOpenFromDialog,
} from './examples/file-upload-dropzone-examples';
import {
  FileUploadHookForm,
  FileUploadInput,
  FileUploadInputClear,
  FileUploadStore,
} from './examples/file-upload-form-examples';
import {
  FileUploadCustomPreview,
  FileUploadPasteEvent,
} from './examples/file-upload-preview-examples';

export const meta = {
  component: FileUploadBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a description, plus any note shown after the example. */
function guide(description: string, after?: string): Story['parameters'] {
  return { guide: { description, ...(after !== undefined && { after }) } };
}

export const Basic: Story = { name: 'Basic', render: FileUploadBasic };
export const AcceptedFiles: Story = {
  name: 'AcceptedFiles',
  render: FileUploadAcceptedFiles,
  parameters: guide('Define the accepted files for upload using the `accept` prop.'),
};
export const Multiple: Story = {
  name: 'Multiple',
  render: FileUploadMultiple,
  parameters: guide('Upload multiple files at once by using the `maxFiles` prop.'),
};
export const CustomPreview: Story = {
  name: 'CustomPreview',
  render: FileUploadCustomPreview,
  parameters: guide("Here's an example of how to show a custom image preview for files."),
};
export const Directory: Story = {
  name: 'Directory',
  render: FileUploadDirectory,
  parameters: guide('Use the `directory` prop to allow selecting a directory instead of a file.'),
};
export const MediaCapture: Story = {
  name: 'MediaCapture',
  render: FileUploadMediaCapture,
  parameters: guide(
    'Use the `capture` prop to select and upload files from different environments and media types.',
    '> **Note:** This is [not fully supported](https://caniuse.com/mdn-api_htmlinputelement_capture) in all browsers.',
  ),
};
export const Dropzone: Story = {
  name: 'Dropzone',
  render: FileUploadDropzone,
  parameters: guide(
    'Drop multiple files inside the dropzone and use the `maxFiles` prop to set the number of files that can be uploaded at once.',
  ),
};
export const ConditionalDropzone: Story = {
  name: 'ConditionalDropzone',
  render: FileUploadConditionalDropzone,
  parameters: guide(
    'Hide the dropzone when the maximum number of files has been reached by using `useFileUploadContext` to access the accepted files count.',
  ),
};
export const Input: Story = {
  name: 'Input',
  render: FileUploadInput,
  parameters: guide(
    'Use `Input` with `asChild` on `FileUpload.Trigger` to create a trigger that looks like a text input.',
  ),
};
export const InputClear: Story = {
  name: 'InputClear',
  render: FileUploadInputClear,
  parameters: guide("Here's an example of a clearable file upload input."),
};
export const PasteEvent: Story = {
  name: 'PasteEvent',
  render: FileUploadPasteEvent,
  parameters: guide("Here's an example of handling files pasted from the clipboard."),
};
export const Store: Story = {
  name: 'Store',
  render: FileUploadStore,
  parameters: guide(
    'An alternative way to control the file upload is to use the `RootProvider` component and the `useFileUpload` store hook.',
    'This way you can access the file upload state and methods from outside the file upload.',
  ),
};
export const OpenFromDialog: Story = {
  name: 'OpenFromDialog',
  render: FileUploadOpenFromDialog,
};
export const HookForm: Story = {
  name: 'HookForm',
  render: FileUploadHookForm,
};
