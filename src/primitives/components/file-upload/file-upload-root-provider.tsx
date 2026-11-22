import type { RootState } from '@zag-js/file-upload';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseFileUploadReturn } from './use-file-upload';
import { FileUploadProvider } from './use-file-upload-context';

interface RootProviderProps {
  value: UseFileUploadReturn;
}

export type FileUploadRootProviderState = RootState;

export type FileUploadRootProviderBaseProps = PolymorphicProps<'div', FileUploadRootProviderState>;
export type FileUploadRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  FileUploadRootProviderBaseProps;

/** Provide the FileUpload root provider to its children. */
export const FileUploadRootProvider = (props: FileUploadRootProviderProps) => {
  const [{ value: fileUpload }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => fileUpload().getRootProps(), localProps);

  return (
    <FileUploadProvider value={fileUpload}>
      <primitive.div {...mergedProps} state={fileUpload().getRootState()} />
    </FileUploadProvider>
  );
};
