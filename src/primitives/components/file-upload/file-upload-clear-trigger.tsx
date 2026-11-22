import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';

export type FileUploadClearTriggerBaseProps = PolymorphicProps<'button'>;
export type FileUploadClearTriggerProps = Assign<
  HTMLProps<'button'>,
  FileUploadClearTriggerBaseProps
>;

/** Render the FileUpload clear trigger. */
export const FileUploadClearTrigger = (props: FileUploadClearTriggerProps) => {
  const fileUpload = useFileUploadContext();
  const mergedProps = mergeProps(() => fileUpload().getClearTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
