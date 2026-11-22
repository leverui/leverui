import { FileUpload as PrimitiveFileUpload } from '../primitives/components/file-upload';
import { primitiveNativeParts } from './primitive-native-parts';

export const fileUploadPartComponents = {
  clearTrigger: PrimitiveFileUpload.ClearTrigger,
  dropzone: PrimitiveFileUpload.Dropzone,
  dropzoneContent: primitiveNativeParts.div,
  fileText: primitiveNativeParts.span,
  item: PrimitiveFileUpload.Item,
  itemContent: primitiveNativeParts.div,
  itemDeleteTrigger: PrimitiveFileUpload.ItemDeleteTrigger,
  itemGroup: PrimitiveFileUpload.ItemGroup,
  itemName: PrimitiveFileUpload.ItemName,
  itemPreview: PrimitiveFileUpload.ItemPreview,
  itemPreviewImage: PrimitiveFileUpload.ItemPreviewImage,
  itemSizeText: PrimitiveFileUpload.ItemSizeText,
  label: PrimitiveFileUpload.Label,
  trigger: PrimitiveFileUpload.Trigger,
} as const;

export const fileUploadPartTags = {
  clearTrigger: 'button',
  dropzone: 'div',
  dropzoneContent: 'div',
  fileText: 'span',
  item: 'li',
  itemContent: 'div',
  itemDeleteTrigger: 'button',
  itemGroup: 'ul',
  itemName: 'div',
  itemPreview: 'div',
  itemPreviewImage: 'img',
  itemSizeText: 'div',
  label: 'label',
  trigger: 'button',
} as const satisfies Record<keyof typeof fileUploadPartComponents, string>;

export type FileUploadPartSlot = keyof typeof fileUploadPartComponents;
