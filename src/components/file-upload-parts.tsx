import { type JSX } from '@solidjs/web';
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import { renderFileUploadPart } from './file-upload-part';
import type {
  FileUploadClearTriggerProps,
  FileUploadDropzoneContentProps,
  FileUploadDropzoneProps,
  FileUploadItemGroupProps,
  FileUploadLabelProps,
  FileUploadTriggerProps,
} from './file-upload-part-props';

/** Render a machine-owned button that clears accepted files. */
export function FileUploadClearTrigger<As extends FileUploadIntrinsicElement = 'button'>(
  props: FileUploadClearTriggerProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('clearTrigger', props);
}

/** Render the interactive file drop target. */
export function FileUploadDropzone<As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadDropzoneProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('dropzone', props);
}

/** Arrange caller content inside a drop target. */
export function FileUploadDropzoneContent<As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadDropzoneContentProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('dropzoneContent', props);
}

/** Group accepted or rejected items under the primitive's file context. */
export function FileUploadItemGroup<As extends FileUploadIntrinsicElement = 'ul'>(
  props: FileUploadItemGroupProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemGroup', props);
}

/** Associate visible text with the machine-owned input. */
export function FileUploadLabel<As extends FileUploadIntrinsicElement = 'label'>(
  props: FileUploadLabelProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('label', props);
}

/** Open the native picker through the primitive's trigger behavior. */
export function FileUploadTrigger<As extends FileUploadIntrinsicElement = 'button'>(
  props: FileUploadTriggerProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('trigger', props);
}
