import type { Assign } from '../../types';
import type { DropzoneProps, DropzoneState } from '@zag-js/file-upload';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useFileUploadContext } from './use-file-upload-context';

export type FileUploadDropzoneState = DropzoneState;

export type FileUploadDropzoneBaseProps = PolymorphicProps<'div', FileUploadDropzoneState> &
  DropzoneProps;
export type FileUploadDropzoneProps = Assign<HTMLProps<'div'>, FileUploadDropzoneBaseProps>;

/** Render the FileUpload dropzone. */
export const FileUploadDropzone = (props: FileUploadDropzoneProps) => {
  const [dropzoneProps, localProps] = createSplitProps<DropzoneProps>()(props, ['disableClick']);
  const fileUpload = useFileUploadContext();
  const mergedProps = mergeProps(() => fileUpload().getDropzoneProps(dropzoneProps), localProps);
  const field = useFieldContext();

  return (
    <primitive.div
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={fileUpload().getDropzoneState()}
    />
  );
};
