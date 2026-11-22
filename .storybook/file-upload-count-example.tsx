import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileUpload, type FileUploadFileRejectDetails } from '../src';

/** Expose the machine's count rejection for a multiple native input. */
export function FileUploadCountExample(): JSX.Element {
  const [rejected, setRejected] = createSignal('');

  /** Show every name rejected by the maximum-file-count rule. */
  function onFileReject(details: FileUploadFileRejectDetails): void {
    setRejected(details.files.map(rejectedFileName).join(','));
  }

  /** Read one rejected file name for the visible count result. */
  function rejectedFileName(entry: FileUploadFileRejectDetails['files'][number]): string {
    return entry.file.name;
  }

  return (
    <>
      <FileUpload.Root maxFiles={2} onFileReject={onFileReject}>
        <FileUpload.HiddenInput data-testid="count-input" />
      </FileUpload.Root>
      <output data-testid="count-rejected">{rejected()}</output>
    </>
  );
}
