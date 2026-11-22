import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  FileUpload,
  type FileUploadFileAcceptDetails,
  type FileUploadFileChangeDetails,
  type FileUploadFileRejectDetails,
  type UseFileUploadContext,
} from '../src';

/** Exercise machine callbacks, validation, and file transformations in Chromium. */
export function FileUploadValidationExample(): JSX.Element {
  const [events, setEvents] = createSignal<string[]>([]);

  /** Add a machine event to the visible browser log. */
  function record(event: string): void {
    /** Append one event without losing prior machine notifications. */
    function appendEvent(previous: string[]): string[] {
      return [...previous, event];
    }
    setEvents(appendEvent);
  }

  /** Record accepted and rejected counts after any selection change. */
  function onFileChange(details: FileUploadFileChangeDetails): void {
    record(`change:${details.acceptedFiles.length}:${details.rejectedFiles.length}`);
  }

  /** Record the accepted file names. */
  function onFileAccept(details: FileUploadFileAcceptDetails): void {
    record(`accept:${details.files.map(fileName).join(',')}`);
  }

  /** Read a native file's name for the visible event log. */
  function fileName(file: File): string {
    return file.name;
  }

  /** Record the files rejected by the machine. */
  function onFileReject(details: FileUploadFileRejectDetails): void {
    record(`reject:${details.files.map(rejectedFileName).join(',')}`);
  }

  /** Read the rejected file's name without losing its machine reason. */
  function rejectedFileName(entry: FileUploadFileRejectDetails['files'][number]): string {
    return entry.file.name;
  }

  /** Rename files asynchronously before they enter the accepted list. */
  async function transformFiles(files: File[]): Promise<File[]> {
    record('transform');
    return files.map(prepareFile);
  }

  /** Give one transformed file a stable, observable name. */
  function prepareFile(file: File): File {
    return new File([file], `prepared-${file.name}`, { type: file.type });
  }

  /** Render a drop target that forwards pasted files to the same machine. */
  function renderDropzone(context: UseFileUploadContext): JSX.Element {
    /** Pass clipboard data to the primitive's file-upload API. */
    function onPaste(event: ClipboardEvent): void {
      context().setClipboardFiles(event.clipboardData);
    }

    return (
      <FileUpload.Dropzone data-testid="validation-dropzone" onPaste={onPaste}>
        Drop or paste documents
      </FileUpload.Dropzone>
    );
  }

  return (
    <>
      <FileUpload.Root
        id="validation-files"
        name="documents"
        accept="text/plain"
        maxFiles={1}
        maxFileSize={8}
        onFileChange={onFileChange}
        onFileAccept={onFileAccept}
        onFileReject={onFileReject}
        transformFiles={transformFiles}
      >
        <FileUpload.Label>Documents</FileUpload.Label>
        <FileUpload.HiddenInput data-testid="validation-input" />
        <FileUpload.Context>{renderDropzone}</FileUpload.Context>
        <FileUpload.Trigger data-testid="validation-trigger">Choose document</FileUpload.Trigger>
        <FileUpload.FileText data-testid="validation-summary" />
        <FileUpload.List clearable />
      </FileUpload.Root>
      <output data-testid="validation-events">{events().join('|')}</output>
    </>
  );
}
