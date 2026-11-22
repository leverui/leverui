import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context';

export type FileUploadItemSizeTextBaseProps = PolymorphicProps<'div'>;
export type FileUploadItemSizeTextProps = Assign<HTMLProps<'div'>, FileUploadItemSizeTextBaseProps>;

/** Render the FileUpload item size text. */
export const FileUploadItemSizeText = (props: FileUploadItemSizeTextProps) => {
  const fileUpload = useFileUploadContext();
  const itemProps = useFileUploadItemPropsContext();
  const mergedProps = mergeProps(() => fileUpload().getItemSizeTextProps(itemProps()), props);

  return (
    <primitive.div {...mergedProps}>
      {props.children || fileUpload().getFileSize(itemProps().file)}
    </primitive.div>
  );
};
