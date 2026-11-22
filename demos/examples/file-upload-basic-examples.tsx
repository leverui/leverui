import { type JSX } from '@solidjs/web';
import { CameraIcon } from '@lucide/solid';
import { Button, FileUpload } from '../../src';
import { UploadButton } from './file-upload-common';

/** Show the default file chooser and accepted list. */
export function FileUploadBasic(): JSX.Element {
  return (
    <FileUpload.Root>
      <FileUpload.HiddenInput />
      <UploadButton />
      <FileUpload.List />
    </FileUpload.Root>
  );
}

/** Accept PNG images while retaining the button and list. */
export function FileUploadAcceptedFiles(): JSX.Element {
  return (
    <FileUpload.Root accept={['image/png']}>
      <FileUpload.HiddenInput />
      <UploadButton />
      <FileUpload.List />
    </FileUpload.Root>
  );
}

/** Accept five files with names, sizes, and item removal. */
export function FileUploadMultiple(): JSX.Element {
  return (
    <FileUpload.Root maxFiles={5}>
      <FileUpload.HiddenInput />
      <UploadButton />
      <FileUpload.List showSize clearable />
    </FileUpload.Root>
  );
}

/** Let the native picker choose a folder. */
export function FileUploadDirectory(): JSX.Element {
  return (
    <FileUpload.Root directory>
      <FileUpload.HiddenInput />
      <UploadButton />
      <FileUpload.List />
    </FileUpload.Root>
  );
}

/** Ask mobile devices to use their rear camera. */
export function FileUploadMediaCapture(): JSX.Element {
  return (
    <FileUpload.Root capture="environment">
      <FileUpload.HiddenInput />
      <FileUpload.Trigger
        asChild={
          /** Forward the picker activation to the styled button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              <CameraIcon /> Open camera
            </Button>
          )
        }
      />
      <FileUpload.List />
    </FileUpload.Root>
  );
}
