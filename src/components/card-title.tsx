import { type JSX } from '@solidjs/web';
import { renderCardPart } from './card-part';
import type { NativeElementTag } from './native-element-props';
import type { CardTitleProps, CardPartRuntimeProps } from './card-props';

/** Render the Card title as a native h3 element. */
function CardTitleComponent(props: CardPartRuntimeProps): JSX.Element {
  return renderCardPart('title', 'h3', props);
}

/** Expose native, selected-tag, and caller-owned Card titles. */
export const CardTitle = CardTitleComponent as <As extends NativeElementTag = 'h3'>(
  props: CardTitleProps<As>,
) => JSX.Element;
