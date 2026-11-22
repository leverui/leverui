import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import type { UseFileUploadProps, UseFileUploadReturn } from './file-upload-types';
import type { ClassValue } from '../utils/class-value';

/** Carry checked native and appearance props through the primitive boundary. */
export type FileUploadRuntimeLocalProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  colorPalette?: string | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: FileUploadIntrinsicElement | undefined;
  asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
  children?: JSX.Element | undefined;
};

export type FileUploadRuntimeRootProps = FileUploadRuntimeLocalProps & UseFileUploadProps;
export type FileUploadRuntimeProviderProps = FileUploadRuntimeLocalProps & {
  value: UseFileUploadReturn;
};
