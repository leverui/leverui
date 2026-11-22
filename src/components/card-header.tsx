import { type JSX } from '@solidjs/web';
import { renderCardPart } from './card-part';
import type { NativeElementTag } from './native-element-props';
import type { CardHeaderProps, CardPartRuntimeProps } from './card-props';

/** Render Card introductory content in the header slot. */
function CardHeaderComponent(props: CardPartRuntimeProps): JSX.Element {
  return renderCardPart('header', 'div', props);
}

/** Expose native, selected-tag, and caller-owned Card headers. */
export const CardHeader = CardHeaderComponent as <As extends NativeElementTag = 'div'>(
  props: CardHeaderProps<As>,
) => JSX.Element;
