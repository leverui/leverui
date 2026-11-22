import { type JSX } from '@solidjs/web';
import { FileUpload } from '../src';

/** Confirm directory and capture machine options reach the native input. */
export function FileUploadAttributesExample(): JSX.Element {
  return (
    <>
      <FileUpload.Root directory capture="environment" accept="image/*">
        <FileUpload.HiddenInput data-testid="attributes-input" />
      </FileUpload.Root>
    </>
  );
}
