import { splitProps } from '../primitives/utils/split-props';
import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { checkboxCardNativeRootKeys, useCheckboxCardNativeRoot } from './checkbox-card-native-root';
import { CheckboxCardPresentationProvider } from './checkbox-card-presentation';
import {
  useCheckboxCardProps,
  type CheckboxCardRootProps,
  type CheckboxCardRuntimeRootProps,
} from './checkbox-card-props';
import { createCheckboxChangeHandler } from './checkbox-change-handler';

/** Compose authored Card presentation with the primitive's checked-state machine. */
function CheckboxCardRootImpl(props: CheckboxCardRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCheckboxCardProps(instance);
  const [local, native] = splitProps(merged, checkboxCardNativeRootKeys);
  const root = useCheckboxCardNativeRoot(local, native, content);
  const handleCheckedChange = createCheckboxChangeHandler(
    /** Read the current consumer callback and controlled state. */
    () => native,
  );
  const primitiveProps = mergeProps(
    /** Keep native attributes reactive without remounting the primitive. */
    root.attributes,
    { onCheckedChange: handleCheckedChange },
  );

  return (
    <CheckboxCardPresentationProvider value={root.presentation}>
      {/* The primitive's checked root contract is narrower than the native adapter. */}
      {createComponent(PrimitiveCheckbox.Root as Component<typeof primitiveProps>, primitiveProps)}
    </CheckboxCardPresentationProvider>
  );
}

/** Expose native, selected-element, and caller-owned Checkbox Card roots. */
export const CheckboxCardRoot = CheckboxCardRootImpl as <
  As extends keyof JSX.IntrinsicElements = 'label',
>(
  props: CheckboxCardRootProps<As>,
) => JSX.Element;
