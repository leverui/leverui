import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { Button, type ButtonProps } from './button';
import type { NativeElementTag } from './native-element-props';

export type IconButtonProps<As extends NativeElementTag = 'button'> = ButtonProps<As>;

/** Render a square Button whose consumer supplies an accessible name. */
function IconButtonRoot(props: IconButtonProps): JSX.Element {
  return (
    <Button
      {...props}
      class={composeRecipeClassNames('icon-button', undefined, props.class, props.className)}
    />
  );
}

/** Preserve the chosen element's native props and ref on the icon action. */
export const IconButton = IconButtonRoot as <As extends NativeElementTag = 'button'>(
  props: IconButtonProps<As>,
) => JSX.Element;
