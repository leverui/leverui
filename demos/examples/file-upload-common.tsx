import { type JSX } from '@solidjs/web';
import { UploadIcon } from '@lucide/solid';
import { Button, FileUpload } from '../../src';
import './file-upload-examples.css';

/** Connect the outline button to the native file chooser. */
export function UploadButton(): JSX.Element {
  return (
    <FileUpload.Trigger
      asChild={
        /** Forward the picker activation to the styled button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size="sm">
            <UploadIcon /> Upload file
          </Button>
        )
      }
    />
  );
}

/** Render the muted upload symbol shown inside a dropzone. */
export function DropzoneIcon(): JSX.Element {
  return <UploadIcon class="example-file-upload-icon" />;
}
