import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileUpload, type FileUploadFileChangeDetails } from '../src';

/** Exercise controlled files without replacing the machine's native input. */
export function FileUploadControlledExample(): JSX.Element {
  const [files, setFiles] = createSignal<File[]>([]);

  /** Replace the controlled selection from outside the upload machine. */
  function setExternalFile(): void {
    setFiles([new File(['external'], 'external.txt', { type: 'text/plain' })]);
  }

  /** Mirror the machine's accepted selection into controlled state. */
  function onFileChange(details: FileUploadFileChangeDetails): void {
    setFiles(details.acceptedFiles);
  }

  return (
    <>
      <FileUpload.Root acceptedFiles={files()} onFileChange={onFileChange}>
        <FileUpload.HiddenInput data-testid="controlled-input" />
        <FileUpload.FileText data-testid="controlled-summary" />
        <FileUpload.List />
      </FileUpload.Root>
      <button type="button" onClick={setExternalFile} data-testid="controlled-external">
        Set external file
      </button>
    </>
  );
}
