import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

export type CheckboxHiddenInputProps = JSX.InputHTMLAttributes<HTMLInputElement> &
  PolymorphicProps<'input'>;

/** Render the primitive's native form control behind a Lever UI Checkbox. */
export function CheckboxHiddenInput(props: CheckboxHiddenInputProps): JSX.Element {
  return <PrimitiveCheckbox.HiddenInput {...props} />;
}
