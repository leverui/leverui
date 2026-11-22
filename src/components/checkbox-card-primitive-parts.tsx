import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import { type JSX } from '@solidjs/web';
import type { CheckboxCardControlProps, CheckboxCardLabelProps } from './checkbox-card-part-props';
import { useCheckboxCardPresentation } from './checkbox-card-presentation';
import { renderCheckboxNativePart } from './checkbox-native-part';

/** Render the primitive's Card control with authored layout and native props. */
export function CheckboxCardControl(props: CheckboxCardControlProps): JSX.Element {
  const presentation = useCheckboxCardPresentation();
  return renderCheckboxNativePart({
    props,
    part: PrimitiveCheckbox.Control,
    name: 'checkbox-card__control',
    presentation,
  });
}

/** Render the primitive's Card label with authored typography and state hooks. */
export function CheckboxCardLabel(props: CheckboxCardLabelProps): JSX.Element {
  const presentation = useCheckboxCardPresentation();
  return renderCheckboxNativePart({
    props,
    part: PrimitiveCheckbox.Label,
    name: 'checkbox-card__label',
    presentation,
  });
}
