import { type JSX } from '@solidjs/web';
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import { CloseIcon } from './close-icon';
import { FileUploadFileIcon } from './file-upload-file-icon';
import { renderFileUploadPart } from './file-upload-part';
import type {
  FileUploadItemContentProps,
  FileUploadItemDeleteTriggerProps,
  FileUploadItemNameProps,
  FileUploadItemPreviewImageProps,
  FileUploadItemPreviewProps,
  FileUploadItemProps,
  FileUploadItemSizeTextProps,
} from './file-upload-part-props';

/** Bind one File to the primitive's item context and recipe. */
export function FileUploadItem<As extends FileUploadIntrinsicElement = 'li'>(
  props: FileUploadItemProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('item', props);
}

/** Arrange an item's file name and size. */
export function FileUploadItemContent<As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadItemContentProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemContent', props);
}

/** Remove one file through the primitive's item action. */
export function FileUploadItemDeleteTrigger<As extends FileUploadIntrinsicElement = 'button'>(
  props: FileUploadItemDeleteTriggerProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemDeleteTrigger', props, <CloseIcon />);
}

/** Display the file name from the nearest item context. */
export function FileUploadItemName<As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadItemNameProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemName', props);
}

/** Display a matching preview or the default file glyph. */
export function FileUploadItemPreview<As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadItemPreviewProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemPreview', props, <FileUploadFileIcon />);
}

/** Display the primitive's object-URL image preview with cleanup. */
export function FileUploadItemPreviewImage<As extends FileUploadIntrinsicElement = 'img'>(
  props: FileUploadItemPreviewImageProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemPreviewImage', props);
}

/** Display the formatted size from the nearest item context. */
export function FileUploadItemSizeText<As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadItemSizeTextProps<As>,
): JSX.Element {
  return renderFileUploadPart<As>('itemSizeText', props);
}
