import type { Assign } from '../../types';
import type { RootState } from '@zag-js/file-upload';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseFileUploadProps, useFileUpload } from './use-file-upload';
import { FileUploadProvider } from './use-file-upload-context';

export type FileUploadRootState = RootState;

export type FileUploadRootBaseProps = UseFileUploadProps &
  PolymorphicProps<'div', FileUploadRootState>;
export type FileUploadRootProps = Assign<HTMLProps<'div'>, FileUploadRootBaseProps>;

/** Render the FileUpload root. */
export const FileUploadRoot = (props: FileUploadRootProps) => {
  const [fileUploadProps, localProps] = createSplitProps<UseFileUploadProps>()(props, [
    'accept',
    'acceptedFiles',
    'allowDrop',
    'capture',
    'defaultAcceptedFiles',
    'directory',
    'disabled',
    'id',
    'ids',
    'invalid',
    'locale',
    'maxFiles',
    'maxFileSize',
    'minFileSize',
    'name',
    'onFileAccept',
    'onFileChange',
    'onFileReject',
    'preventDocumentDrop',
    'readOnly',
    'required',
    'translations',
    'transformFiles',
    'validate',
  ]);

  const fileUpload = useFileUpload(fileUploadProps);
  const mergedProps = mergeProps(() => fileUpload().getRootProps(), localProps);

  return (
    <FileUploadProvider value={fileUpload}>
      <primitive.div {...mergedProps} state={fileUpload().getRootState()} />
    </FileUploadProvider>
  );
};
