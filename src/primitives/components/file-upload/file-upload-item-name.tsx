import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context';

export type FileUploadItemNameBaseProps = PolymorphicProps<'div'>;
export type FileUploadItemNameProps = Assign<HTMLProps<'div'>, FileUploadItemNameBaseProps>;

/** Render the FileUpload item name. */
export const FileUploadItemName = (props: FileUploadItemNameProps) => {
  const fileUpload = useFileUploadContext();
  const itemProps = useFileUploadItemPropsContext();
  const mergedProps = mergeProps(() => fileUpload().getItemNameProps(itemProps()), props);

  return <primitive.div {...mergedProps}>{props.children || itemProps().file.name}</primitive.div>;
};
