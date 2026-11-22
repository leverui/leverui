import { FileUpload } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed picker, item helpers, and consumer CSS tokens. */
export function PackedFileUpload(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);

  /** Toggle native picker state without remounting the machine. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  return (
    <section class="packed-file-upload" aria-label="Packed File Upload example">
      <FileUpload.Root disabled={disabled()} maxFiles={2} data-testid="packed-file-upload-root">
        <FileUpload.Label>Documents</FileUpload.Label>
        <FileUpload.HiddenInput data-testid="packed-file-upload-input" />
        <FileUpload.Dropzone data-testid="packed-file-upload-dropzone">
          <FileUpload.DropzoneContent>Drop documents here</FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        <FileUpload.Trigger>Choose documents</FileUpload.Trigger>
        <FileUpload.FileText data-testid="packed-file-upload-text" />
        <FileUpload.List clearable showSize />
      </FileUpload.Root>
      <button type="button" onClick={toggleDisabled} data-testid="packed-file-upload-toggle">
        Toggle picker
      </button>
    </section>
  );
}
