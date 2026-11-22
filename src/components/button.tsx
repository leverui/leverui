import { type JSX } from '@solidjs/web';
import { useButtonProps, type ButtonBaseProps, type ButtonRootProps } from './button-props';
import { NativeButton } from './native-button';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type ButtonProps<As extends NativeElementTag = 'button'> = NativeElementProps<
  'button',
  ButtonBaseProps,
  As
>;

/** Render a Button with the current provider defaults and authored CSS. */
function ButtonRoot(props: ButtonRootProps): JSX.Element {
  const merged = useButtonProps(props);
  return <NativeButton {...merged} />;
}

/** Render a native button or a selected element with matching props and refs. */
export const Button = ButtonRoot as <As extends NativeElementTag = 'button'>(
  props: ButtonProps<As>,
) => JSX.Element;
