import { type JSX } from '@solidjs/web';
import { renderCardPart } from './card-part';
import type { NativeElementTag } from './native-element-props';
import type { CardBodyProps, CardPartRuntimeProps } from './card-props';

/** Render Card content in its flexible body slot. */
function CardBodyComponent(props: CardPartRuntimeProps): JSX.Element {
  return renderCardPart('body', 'div', props);
}

/** Expose native, selected-tag, and caller-owned Card bodies. */
export const CardBody = CardBodyComponent as <As extends NativeElementTag = 'div'>(
  props: CardBodyProps<As>,
) => JSX.Element;
