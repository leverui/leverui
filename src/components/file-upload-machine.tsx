import {
  useFileUpload as usePrimitiveFileUpload,
  useFileUploadContext as usePrimitiveFileUploadContext,
} from '../primitives/components/file-upload';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { UseFileUploadProps, UseFileUploadReturn } from './file-upload-types';

export type {
  FileUploadFileAcceptDetails,
  FileUploadFileChangeDetails,
  FileUploadFileError,
  FileUploadFileMimeType,
  FileUploadFileRejectDetails,
  FileUploadFileRejection,
  FileUploadFileValidateDetails,
  UseFileUploadProps,
  UseFileUploadReturn,
  UseFileUploadContext,
} from './file-upload-types';

export interface FileUploadContextProps {
  /** Render custom content with the nearest reactive file accessor. */
  children: (context: UseFileUploadReturn) => JSX.Element;
}

/** Create a caller-owned primitive File Upload accessor. */
export function useFileUpload(
  props?: UseFileUploadProps | Accessor<UseFileUploadProps>,
): UseFileUploadReturn {
  return usePrimitiveFileUpload(props);
}

/** Read the nearest File Upload machine without changing its state. */
export function useFileUploadContext(): UseFileUploadReturn {
  return usePrimitiveFileUploadContext();
}

/** Render the current File Upload accessor through a caller function. */
export function FileUploadContext(props: FileUploadContextProps): JSX.Element {
  return <>{props.children(useFileUploadContext())}</>;
}
