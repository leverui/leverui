import type { Assign } from '../../types';
import type { TriggerState } from '@zag-js/file-upload';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useFileUploadContext } from './use-file-upload-context';

export type FileUploadTriggerState = TriggerState;

export type FileUploadTriggerBaseProps = PolymorphicProps<'button', FileUploadTriggerState>;
export type FileUploadTriggerProps = Assign<HTMLProps<'button'>, FileUploadTriggerBaseProps>;

/** Render the FileUpload trigger. */
export const FileUploadTrigger = (props: FileUploadTriggerProps) => {
  const fileUpload = useFileUploadContext();
  const mergedProps = mergeProps(() => fileUpload().getTriggerProps(), props);
  const field = useFieldContext();

  return (
    <primitive.button
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={fileUpload().getTriggerState()}
    />
  );
};
