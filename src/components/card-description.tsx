import { type JSX } from '@solidjs/web';
import { renderCardPart } from './card-part';
import type { NativeElementTag } from './native-element-props';
import type { CardDescriptionProps, CardPartRuntimeProps } from './card-props';

/** Render supporting Card text as a native paragraph. */
function CardDescriptionComponent(props: CardPartRuntimeProps): JSX.Element {
  return renderCardPart('description', 'p', props);
}

/** Expose native, selected-tag, and caller-owned Card descriptions. */
export const CardDescription = CardDescriptionComponent as <As extends NativeElementTag = 'p'>(
  props: CardDescriptionProps<As>,
) => JSX.Element;
