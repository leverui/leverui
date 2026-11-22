import { FileUpload as PrimitiveFileUpload } from '../primitives/components/file-upload';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';

type NativeHiddenInputProps = JSX.IntrinsicElements['input'] & { asChild?: never };
type SelectedHiddenInputProps = Omit<JSX.IntrinsicElements['input'], 'ref'> & {
  asChild: NonNullable<PolymorphicProps<'input'>['asChild']>;
  ref?: ((element: Element) => void) | undefined;
};

export type FileUploadHiddenInputProps = NativeHiddenInputProps | SelectedHiddenInputProps;

/** Keep the primitive's native file input behind a Lever UI-owned public declaration. */
export function FileUploadHiddenInput(props: FileUploadHiddenInputProps): JSX.Element {
  // The primitive owns the hidden input; its published File Upload declaration is malformed.
  const attributes = mergeProps(props, {
    /** Keep the hidden native input discoverable through a stable part hook. */
    get class() {
      return composeRecipeClassNames('file-upload__hiddenInput', undefined, props.class);
    },
  });
  return createComponent(PrimitiveFileUpload.HiddenInput, attributes);
}
