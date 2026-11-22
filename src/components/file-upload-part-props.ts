import type { DropzoneProps, ItemGroupProps } from '@zag-js/file-upload';
import type {
  FileUploadElementProps,
  FileUploadIntrinsicElement,
} from './file-upload-element-props';

export type FileUploadClearTriggerProps<As extends FileUploadIntrinsicElement = 'button'> =
  FileUploadElementProps<'button', object, As>;
export type FileUploadDropzoneProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', DropzoneProps, As>;
export type FileUploadDropzoneContentProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', object, As>;
export type FileUploadItemProps<As extends FileUploadIntrinsicElement = 'li'> =
  FileUploadElementProps<'li', { file: File }, As>;
export type FileUploadItemContentProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', object, As>;
export type FileUploadItemDeleteTriggerProps<As extends FileUploadIntrinsicElement = 'button'> =
  FileUploadElementProps<'button', object, As>;
export type FileUploadItemGroupProps<As extends FileUploadIntrinsicElement = 'ul'> =
  FileUploadElementProps<'ul', ItemGroupProps, As>;
export type FileUploadItemNameProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', object, As>;
export type FileUploadItemPreviewProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', { type?: string }, As>;
export type FileUploadItemPreviewImageProps<As extends FileUploadIntrinsicElement = 'img'> =
  FileUploadElementProps<'img', object, As>;
export type FileUploadItemSizeTextProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', object, As>;
export type FileUploadLabelProps<As extends FileUploadIntrinsicElement = 'label'> =
  FileUploadElementProps<'label', object, As>;
export type FileUploadTriggerProps<As extends FileUploadIntrinsicElement = 'button'> =
  FileUploadElementProps<'button', object, As>;
export type FileUploadFileTextProps<As extends FileUploadIntrinsicElement = 'span'> =
  FileUploadElementProps<'span', { fallback?: string }, As>;

export interface FileUploadItemsBaseProps {
  showSize?: boolean | undefined;
  clearable?: boolean | undefined;
  files?: File[] | undefined;
}

type OmitEach<Union, Keys extends PropertyKey> = Union extends object ? Omit<Union, Keys> : never;

export type FileUploadItemsProps<As extends FileUploadIntrinsicElement = 'li'> = OmitEach<
  FileUploadItemProps<As>,
  'file' | 'children'
> &
  FileUploadItemsBaseProps;
export type FileUploadListProps<As extends FileUploadIntrinsicElement = 'ul'> = OmitEach<
  FileUploadItemGroupProps<As>,
  'children'
> &
  FileUploadItemsBaseProps;
