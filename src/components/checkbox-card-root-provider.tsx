import { splitProps } from '../primitives/utils/split-props';
import { Checkbox as PrimitiveCheckbox } from '../primitives/components/checkbox';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { checkboxCardNativeRootKeys, useCheckboxCardNativeRoot } from './checkbox-card-native-root';
import { CheckboxCardPresentationProvider } from './checkbox-card-presentation';
import {
  useCheckboxCardRootProviderProps,
  type CheckboxCardRootProviderProps,
  type CheckboxCardRuntimeProviderProps,
} from './checkbox-card-props';

/** Render a native Card around the caller's the primitive checkbox machine. */
function CheckboxCardRootProviderImpl(props: CheckboxCardRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCheckboxCardRootProviderProps(instance);
  const [local, native] = splitProps(merged, [...checkboxCardNativeRootKeys, 'value']);
  const root = useCheckboxCardNativeRoot(local, native, content);
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
    <CheckboxCardPresentationProvider value={root.presentation}>
      {/* The primitive's provider props are narrower than the native adapter. */}
      {createComponent(
        PrimitiveCheckbox.RootProvider as Component<typeof primitiveProps>,
        primitiveProps,
      )}
    </CheckboxCardPresentationProvider>
  );
}

/** Expose native, selected-element, and caller-owned Card provider roots. */
export const CheckboxCardRootProvider = CheckboxCardRootProviderImpl as <
  As extends keyof JSX.IntrinsicElements = 'label',
>(
  props: CheckboxCardRootProviderProps<As>,
) => JSX.Element;
