import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { checkmarkAttributes } from './checkmark-attributes';
import { CheckboxIndicator } from './checkbox-indicator';
import { renderCheckboxNativePart } from './checkbox-native-part';
import type { CheckboxControlProps, CheckboxLabelProps } from './checkbox-native-part-props';
import { useCheckboxPresentation } from './checkbox-presentation';

export type { CheckboxControlProps, CheckboxLabelProps } from './checkbox-native-part-props';

/** Render the primitive's Control with shared Checkmark geometry from authored CSS. */
export function CheckboxControl(props: CheckboxControlProps): JSX.Element {
  const presentation = useCheckboxPresentation();
  return renderCheckboxNativePart({
    props,
    part: PrimitiveCheckbox.Control,
    name: 'checkbox__control',
    presentation,
    /** Apply Checkmark size and treatment to the primitive's visible control. */
    attributes: () => checkmarkAttributes(presentation().choices),
    sharedClass: 'lui-checkmark',
    /** Supply the default SVG only when consumers omit children. */
    defaultChildren: () => createComponent(CheckboxIndicator, {}),
  });
}

/** Render the primitive's native Label with authored typography and state hooks. */
export function CheckboxLabel(props: CheckboxLabelProps): JSX.Element {
  const presentation = useCheckboxPresentation();
  return renderCheckboxNativePart({
    props,
    part: PrimitiveCheckbox.Label,
    name: 'checkbox__label',
    presentation,
  });
}
