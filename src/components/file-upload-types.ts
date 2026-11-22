import type { PropTypes } from '@zag-js/solid';
import type {
  Api,
  FileAcceptDetails,
  FileChangeDetails,
  FileError,
  FileMimeType,
  FileRejectDetails,
  FileRejection,
  FileValidateDetails,
  Props,
} from '@zag-js/file-upload';
import { type Accessor } from 'solid-js';

/** Expose Zag's complete file machine options without the primitive's broken declarations. */
export type UseFileUploadProps = Omit<Props, 'id' | 'dir' | 'getRootNode'> & { id?: string };
export type UseFileUploadReturn = Accessor<Api<PropTypes>>;
export type UseFileUploadContext = UseFileUploadReturn;

export type FileUploadFileAcceptDetails = FileAcceptDetails;
export type FileUploadFileChangeDetails = FileChangeDetails;
export type FileUploadFileRejectDetails = FileRejectDetails;
export type FileUploadFileValidateDetails = FileValidateDetails;
export type FileUploadFileError = FileError;
export type FileUploadFileMimeType = FileMimeType;
export type FileUploadFileRejection = FileRejection;
