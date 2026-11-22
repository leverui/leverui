import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context';

export interface FileUploadItemPreviewBaseProps extends PolymorphicProps<'div'> {
  /**
   * The file type to match against. Matches all file types by default.
   * @default '.*'
   */
  type?: string;
}
export type FileUploadItemPreviewProps = Assign<HTMLProps<'div'>, FileUploadItemPreviewBaseProps>;

/** Render the FileUpload item preview. */
export const FileUploadItemPreview = (props: FileUploadItemPreviewProps) => {
  const fileUpload = useFileUploadContext();
  const itemProps = useFileUploadItemPropsContext();
  const mergedProps = mergeProps(() => fileUpload().getItemPreviewProps(itemProps()), props);

  if (!itemProps().file.type.match(props.type ?? '.*')) return null;

  return <primitive.div {...mergedProps} />;
};
