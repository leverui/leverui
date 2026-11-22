import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useFileUploadContext } from './use-file-upload-context';

export type FileUploadHiddenInputBaseProps = PolymorphicProps<'input'>;
export type FileUploadHiddenInputProps = Assign<HTMLProps<'input'>, FileUploadHiddenInputBaseProps>;

/** Render the FileUpload hidden input. */
export const FileUploadHiddenInput = (props: FileUploadHiddenInputProps) => {
  const fileUpload = useFileUploadContext();
  const mergedProps = mergeProps(() => fileUpload().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
