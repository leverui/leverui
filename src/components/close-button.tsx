import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { CloseIcon } from './close-icon';
import { IconButton, type IconButtonProps } from './icon-button';
import type { NativeElementTag } from './native-element-props';

export type CloseButtonProps<As extends NativeElementTag = 'button'> = IconButtonProps<As>;

/** Render an icon action with the default Close name and ghost variant. */
function CloseButtonRoot(props: CloseButtonProps): JSX.Element {
  return (
    <IconButton
      variant="ghost"
      aria-label="Close"
      {...props}
      class={composeRecipeClassNames('close-button', undefined, props.class, props.className)}
    >
      {props.children ?? <CloseIcon />}
    </IconButton>
  );
}

/** Preserve the chosen element's native props and ref on the close action. */
export const CloseButton = CloseButtonRoot as <As extends NativeElementTag = 'button'>(
  props: CloseButtonProps<As>,
) => JSX.Element;
