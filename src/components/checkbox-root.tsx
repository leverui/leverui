import { splitProps } from '../primitives/utils/split-props';
import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { createCheckboxChangeHandler } from './checkbox-change-handler';
import { checkboxNativeRootKeys, useCheckboxNativeRoot } from './checkbox-native-root';
import { CheckboxPresentationProvider } from './checkbox-presentation';
import {
  useCheckboxProps,
  type CheckboxRootProps,
  type CheckboxRuntimeRootProps,
} from './checkbox-props';

/** Compose native Checkbox presentation with the primitive's checked-state machine. */
function CheckboxRootImpl(props: CheckboxRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCheckboxProps(instance);
  const [local, native] = splitProps(merged, checkboxNativeRootKeys);
  const root = useCheckboxNativeRoot(local, native, content);
  const handleCheckedChange = createCheckboxChangeHandler(
    /** Read the current consumer callback and controlled state. */
    () => native,
  );
  const primitiveProps = mergeProps(
    /** Keep native attributes reactive without remounting the machine. */
    root.attributes,
    { onCheckedChange: handleCheckedChange },
  );

  return (
    <CheckboxPresentationProvider value={root.presentation}>
      {/* The primitive's checked root contract is narrower than the native adapter. */}
      {createComponent(PrimitiveCheckbox.Root as Component<typeof primitiveProps>, primitiveProps)}
    </CheckboxPresentationProvider>
  );
}

/** Expose native, selected-element, and caller-owned Checkbox roots. */
export const CheckboxRoot = CheckboxRootImpl as <As extends keyof JSX.IntrinsicElements = 'label'>(
  props: CheckboxRootProps<As>,
) => JSX.Element;
