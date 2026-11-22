import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FileUpload } from '../src';
import './file-upload-css.css';

/** Expose public part hooks and ordinary consumer CSS overrides. */
function FileUploadCssContract(): JSX.Element {
  return (
    <div style={{ display: 'grid', gap: '24px', padding: '24px' }}>
      <FileUpload.Root class="file-upload-css-root" data-testid="file-css-root" colorPalette="blue">
        <FileUpload.Label class="file-upload-css-label" data-testid="file-css-label">
          Attach a document
        </FileUpload.Label>
        <FileUpload.HiddenInput name="attachment" data-testid="file-css-hidden" />
        <FileUpload.Dropzone class="file-upload-css-dropzone" data-testid="file-css-dropzone">
          <FileUpload.DropzoneContent data-testid="file-css-dropzone-content">
            Drop a document here
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        <FileUpload.Trigger data-testid="file-css-trigger">Choose file</FileUpload.Trigger>
        <FileUpload.FileText data-testid="file-css-text" />
        <FileUpload.List showSize clearable data-testid="file-css-list" />
      </FileUpload.Root>
      <FileUpload.Root unstyled data-testid="file-css-unstyled-root">
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone class="file-upload-css-unstyled" data-testid="file-css-unstyled">
          Unstyled dropzone
        </FileUpload.Dropzone>
      </FileUpload.Root>
      <FileUpload.Root data-testid="file-css-part-root">
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone
          unstyled
          class="file-upload-css-unstyled"
          data-testid="file-css-part-unstyled"
        >
          Locally unstyled
        </FileUpload.Dropzone>
      </FileUpload.Root>
    </div>
  );
}

const meta = {
  title: 'Internal/File Upload CSS',
  component: FileUploadCssContract,
} satisfies Meta<typeof FileUploadCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: FileUploadCssContract };
