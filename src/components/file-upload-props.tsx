import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  FileUploadElementProps,
  FileUploadIntrinsicElement,
} from './file-upload-element-props';
import type { UseFileUploadProps, UseFileUploadReturn } from './file-upload-types';
import type { FileUploadRuntimeRootProps } from './file-upload-runtime-props';

export type FileUploadRootBaseProps = UseFileUploadProps & {
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
};
export type FileUploadRootProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<'div', FileUploadRootBaseProps, As>;
export type FileUploadRootProviderProps<As extends FileUploadIntrinsicElement = 'div'> =
  FileUploadElementProps<
    'div',
    { value: UseFileUploadReturn } & Omit<FileUploadRootBaseProps, keyof UseFileUploadProps>,
    As
  >;

type FileUploadDefaults = Partial<FileUploadRootBaseProps>;

export interface FileUploadPropsProviderProps {
  value: FileUploadDefaults | Accessor<FileUploadDefaults>;
  children: JSX.Element;
}

const FileUploadPropsContext = createOptionalContext<Accessor<FileUploadDefaults>>();

/** Supply reactive defaults to nested File Upload roots. */
export function FileUploadPropsProvider(props: FileUploadPropsProviderProps): JSX.Element {
  /** Read the current defaults without freezing caller-owned state. */
  function readDefaults(): FileUploadDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <FileUploadPropsContext value={readDefaults}>{props.children}</FileUploadPropsContext>;
}

/** Apply inherited root defaults before the instance's own props. */
export function useFileUploadRootProps(
  instance: FileUploadRuntimeRootProps,
): FileUploadRuntimeRootProps {
  const inherited = useOptionalContext(FileUploadPropsContext);
  return mergeRecipeProps<FileUploadRuntimeRootProps>(
    /** Recompute inherited defaults when their accessor changes. */
    () => inherited?.() ?? {},
    instance,
  );
}
