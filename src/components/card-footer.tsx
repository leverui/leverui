import { type JSX } from '@solidjs/web';
import { renderCardPart } from './card-part';
import type { NativeElementTag } from './native-element-props';
import type { CardFooterProps, CardPartRuntimeProps } from './card-props';

/** Render Card actions or concluding content in the footer slot. */
function CardFooterComponent(props: CardPartRuntimeProps): JSX.Element {
  return renderCardPart('footer', 'div', props);
}

/** Expose native, selected-tag, and caller-owned Card footers. */
export const CardFooter = CardFooterComponent as <As extends NativeElementTag = 'div'>(
  props: CardFooterProps<As>,
) => JSX.Element;
