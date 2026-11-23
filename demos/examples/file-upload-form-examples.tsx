import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileUpIcon } from '@lucide/solid';
import {
  Button,
  CloseButton,
  Code,
  Field,
  FileUpload,
  Input,
  InputGroup,
  Stack,
  useFileUpload,
  type FileUploadFileChangeDetails,
} from '../../src';
import { UploadButton } from './file-upload-common';
import './file-upload-examples.css';

/** Validate the form's required image selection in Solid. */
export function FileUploadHookForm(): JSX.Element {
  const [files, setFiles] = createSignal<File[]>([]);
  const [error, setError] = createSignal('');

  /** Keep form state in sync with the file machine. */
  function onFileChange(details: FileUploadFileChangeDetails): void {
    setFiles(details.acceptedFiles);
    if (details.acceptedFiles.length) setError('');
  }

  /** Require at least one selected image before form submission. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (!files().length) {
      setError('At least one image is required');
      return;
    }
    console.log({ images: files() });
  }

  return (
    <form onSubmit={submit}>
      <Field.Root invalid={Boolean(error())}>
        <Field.Label>Images</Field.Label>
        <FileUpload.Root name="images" onFileChange={onFileChange}>
          <FileUpload.HiddenInput />
          <UploadButton />
          <FileUpload.List />
        </FileUpload.Root>
        <Field.ErrorText>{error()}</Field.ErrorText>
      </Field.Root>
      <Button type="submit" size="sm" class="example-file-upload-submit">
        Submit
      </Button>
    </form>
  );
}

/** Show a labeled file chooser using the input treatment. */
export function FileUploadInput(): JSX.Element {
  return (
    <FileUpload.Root class="example-file-upload-field">
      <FileUpload.HiddenInput />
      <FileUpload.Label>Upload file</FileUpload.Label>
      <Input
        asChild={
          /** Make the file trigger read visually as a standard input. */
          (getProps) => (
            <FileUpload.Trigger {...getProps()}>
              <FileUpload.FileText />
            </FileUpload.Trigger>
          )
        }
      />
    </FileUpload.Root>
  );
}

/** Add a leading file icon and a trailing clear action to the input treatment. */
export function FileUploadInputClear(): JSX.Element {
  return (
    <FileUpload.Root class="example-file-upload-field">
      <FileUpload.HiddenInput />
      <FileUpload.Label>Upload file</FileUpload.Label>
      <InputGroup
        startElement={<FileUpIcon />}
        endElement={
          <FileUpload.ClearTrigger
            asChild={
              /** Give the close control the file machine's clear action. */
              (getProps) => (
                <CloseButton
                  {...getProps()}
                  size="xs"
                  variant="plain"
                  aria-label="Clear file"
                  style={{
                    'margin-inline-end': 'calc(var(--lui-spacing-1) * -1)',
                    'pointer-events': 'auto',
                  }}
                />
              )
            }
          />
        }
      >
        <Input
          asChild={
            /** Make the file trigger read visually as a standard input. */
            (getProps) => (
              <FileUpload.Trigger {...getProps()}>
                <FileUpload.FileText class="example-file-upload-file-name" />
              </FileUpload.Trigger>
            )
          }
        />
      </InputGroup>
    </FileUpload.Root>
  );
}

/** Expose accepted and rejected names from a caller-owned file upload store. */
export function FileUploadStore(): JSX.Element {
  const upload = useFileUpload({ maxFiles: 1, maxFileSize: 3000 });
  return (
    <Stack align="flex-start">
      <Code colorPalette="green">
        accepted:{' '}
        {upload()
          .acceptedFiles.map(
            /** Display only file names in the external store summary. */
            (file) => file.name,
          )
          .join(', ')}
      </Code>
      <Code colorPalette="red">
        rejected:{' '}
        {upload()
          .rejectedFiles.map(
            /** Display the rejected file's name. */
            (entry) => entry.file.name,
          )
          .join(', ')}
      </Code>
      <FileUpload.RootProvider value={upload}>
        <FileUpload.HiddenInput />
        <UploadButton />
        <FileUpload.List />
      </FileUpload.RootProvider>
    </Stack>
  );
}
