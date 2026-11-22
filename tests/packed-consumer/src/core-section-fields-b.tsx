import { type JSX } from '@solidjs/web';
import { PackedTextarea } from './textarea-example';
import { PackedFieldset } from './fieldset-example';
import { PackedFileUpload } from './file-upload-example';
import { PackedEditable } from './editable-example';

/** Render the remaining packaged form controls. */
export default function PackedCoreFieldsB(): JSX.Element {
  return (
    <>
      <PackedTextarea />
      <PackedFieldset />
      <PackedFileUpload />
      <PackedEditable />
    </>
  );
}
