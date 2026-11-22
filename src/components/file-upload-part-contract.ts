import { type JSX } from '@solidjs/web';
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import type {
  FileUploadClearTriggerProps,
  FileUploadDropzoneContentProps,
  FileUploadDropzoneProps,
  FileUploadFileTextProps,
  FileUploadItemContentProps,
  FileUploadItemDeleteTriggerProps,
  FileUploadItemGroupProps,
  FileUploadItemNameProps,
  FileUploadItemPreviewImageProps,
  FileUploadItemPreviewProps,
  FileUploadItemProps,
  FileUploadItemSizeTextProps,
  FileUploadLabelProps,
  FileUploadTriggerProps,
} from './file-upload-part-props';

export type FileUploadPartRenderer = {
  <As extends FileUploadIntrinsicElement>(
    slot: 'clearTrigger',
    props: FileUploadClearTriggerProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'dropzone',
    props: FileUploadDropzoneProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'dropzoneContent',
    props: FileUploadDropzoneContentProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'fileText',
    props: FileUploadFileTextProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'item',
    props: FileUploadItemProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemContent',
    props: FileUploadItemContentProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemDeleteTrigger',
    props: FileUploadItemDeleteTriggerProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemGroup',
    props: FileUploadItemGroupProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemName',
    props: FileUploadItemNameProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemPreview',
    props: FileUploadItemPreviewProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemPreviewImage',
    props: FileUploadItemPreviewImageProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'itemSizeText',
    props: FileUploadItemSizeTextProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'label',
    props: FileUploadLabelProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
  <As extends FileUploadIntrinsicElement>(
    slot: 'trigger',
    props: FileUploadTriggerProps<As>,
    defaultChildren?: JSX.Element,
  ): JSX.Element;
};
