import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FileUpload } from '../src';

/** Exercise the native picker, item actions, drop target, and CSS appearance. */
function FileUploadContractExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);

  /** Change the native picker state without remounting its root. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  return (
    <>
      <div data-testid="file-upload-contract" style={{ width: '420px' }}>
        <FileUpload.Root
          id="story-files"
          maxFiles={2}
          disabled={disabled()}
          data-testid="file-upload-root"
        >
          <FileUpload.Label>Attachments</FileUpload.Label>
          <FileUpload.HiddenInput data-testid="file-upload-input" />
          <FileUpload.Dropzone data-testid="file-upload-dropzone">
            <FileUpload.DropzoneContent>Drop up to two files here</FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.Trigger data-testid="file-upload-trigger">Choose files</FileUpload.Trigger>
          <FileUpload.FileText data-testid="file-upload-text" />
          <FileUpload.List showSize clearable />
          <FileUpload.ClearTrigger data-testid="file-upload-clear">
            Clear all
          </FileUpload.ClearTrigger>
        </FileUpload.Root>
        <button type="button" onClick={toggleDisabled} data-testid="file-upload-toggle">
          Toggle disabled
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/File Upload',
  component: FileUploadContractExample,
} satisfies Meta<typeof FileUploadContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
