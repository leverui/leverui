import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { UploadIcon } from '@lucide/solid';
import { Button, Dialog, FileUpload, Portal, useFileUploadContext } from '../../src';
import { DropzoneIcon } from './file-upload-common';
import './dialog-utilities.css';
import './file-upload-examples.css';

/** Accept up to ten files through the drop target. */
export function FileUploadDropzone(): JSX.Element {
  return (
    <FileUpload.Root maxFiles={10} class="example-file-upload-dropzone-root">
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <DropzoneIcon />
        <FileUpload.DropzoneContent>
          <div>Drag and drop files here</div>
          <div class="example-file-upload-hint">.png, .jpg up to 5MB</div>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root>
  );
}

const MAX_FILES = 3;

/** Hide the drop target when its file allowance is full. */
function ConditionalDropzone(): JSX.Element {
  const upload = useFileUploadContext();

  /** Read how many more files the upload accepts. */
  function remaining(): number {
    return MAX_FILES - upload().acceptedFiles.length;
  }

  return (
    <Show when={remaining() > 0}>
      <FileUpload.Dropzone>
        <DropzoneIcon />
        <FileUpload.DropzoneContent>
          <div>Drag and drop files here</div>
          <div class="example-file-upload-hint">
            {remaining()} more file{remaining() !== 1 ? 's' : ''} allowed
          </div>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </Show>
  );
}

/** Show a live remaining-file count and allow item removal. */
export function FileUploadConditionalDropzone(): JSX.Element {
  return (
    <FileUpload.Root maxFiles={MAX_FILES} class="example-file-upload-dropzone-root">
      <FileUpload.HiddenInput />
      <ConditionalDropzone />
      <FileUpload.List clearable />
    </FileUpload.Root>
  );
}

/** Place a file dropzone inside a modal dialog. */
export function FileUploadOpenFromDialog(): JSX.Element {
  return (
    <Dialog.Root size="sm" placement="center">
      <Dialog.Trigger
        asChild={
          /** Give the outline button the dialog activation props. */
          (getProps) => (
            <Button {...getProps()} variant="outline">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload a file</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body class="example-dialog-body-bottom-six">
              <Dialog.Description class="example-dialog-description-gap">
                Drag a file into the box below to add it.
              </Dialog.Description>
              <FileUpload.Root>
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone class="example-file-upload-dialog-dropzone">
                  <UploadIcon class="example-file-upload-dialog-icon" />
                  <FileUpload.DropzoneContent>Drag and drop files here</FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                <FileUpload.List />
              </FileUpload.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
