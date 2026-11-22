import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';

export type FileUploadLabelBaseProps = PolymorphicProps<'label'>;
export type FileUploadLabelProps = Assign<HTMLProps<'label'>, FileUploadLabelBaseProps>;

/** Render the FileUpload label. */
export const FileUploadLabel = (props: FileUploadLabelProps) => {
  const fileUpload = useFileUploadContext();
  const mergedProps = mergeProps(() => fileUpload().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
