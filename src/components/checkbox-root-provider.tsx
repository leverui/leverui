import { splitProps } from '../primitives/utils/split-props';
import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { checkboxNativeRootKeys, useCheckboxNativeRoot } from './checkbox-native-root';
import { CheckboxPresentationProvider } from './checkbox-presentation';
import {
  useCheckboxRootProviderProps,
  type CheckboxRootProviderProps,
  type CheckboxRuntimeProviderProps,
} from './checkbox-props';

/** Render a native Checkbox root around the caller's the primitive machine. */
function CheckboxRootProviderImpl(props: CheckboxRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCheckboxRootProviderProps(instance);
  const [local, native] = splitProps(merged, [...checkboxNativeRootKeys, 'value']);
  const root = useCheckboxNativeRoot(local, native, content);
  const primitiveProps = mergeProps(
    /** Keep native attributes reactive under a caller-owned machine. */
    root.attributes,
    {
      /** Preserve the caller's live machine without inherited behavior defaults. */
      get value() {
        return local.value;
      },
    },
  );

  return (
    <CheckboxPresentationProvider value={root.presentation}>
      {/* The primitive's provider props are narrower than the native adapter. */}
      {createComponent(
        PrimitiveCheckbox.RootProvider as Component<typeof primitiveProps>,
        primitiveProps,
      )}
    </CheckboxPresentationProvider>
  );
}

/** Expose native, selected-element, and caller-owned provider roots. */
export const CheckboxRootProvider = CheckboxRootProviderImpl as <
  As extends keyof JSX.IntrinsicElements = 'label',
>(
  props: CheckboxRootProviderProps<As>,
) => JSX.Element;
