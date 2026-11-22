import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context';

export type FileUploadItemDeleteTriggerBaseProps = PolymorphicProps<'button'>;
export type FileUploadItemDeleteTriggerProps = Assign<
  HTMLProps<'button'>,
  FileUploadItemDeleteTriggerBaseProps
>;

/** Render the FileUpload item delete trigger. */
export const FileUploadItemDeleteTrigger = (props: FileUploadItemDeleteTriggerProps) => {
  const fileUpload = useFileUploadContext();
  const itemProps = useFileUploadItemPropsContext();
  const mergedProps = mergeProps(() => fileUpload().getItemDeleteTriggerProps(itemProps()), props);

  return <primitive.button {...mergedProps} />;
};
