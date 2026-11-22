import { splitProps } from '../primitives/utils/split-props';
import { createComponent, type Accessor, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderCheckboxPartChild, type PrimitivePartGetProps } from './checkbox-part-child';
import type { CheckboxControlProps, CheckboxLabelProps } from './checkbox-native-part-props';
import { composeRecipeClassNames } from '../styled-system/recipe-class';

interface NativePartOptions<PrimitiveProps extends object> {
  props: CheckboxControlProps | CheckboxLabelProps;
  part: Component<PrimitiveProps>;
  name: string;
  presentation: Accessor<{ unstyled: boolean }>;
  attributes?: Accessor<object>;
  sharedClass?: string;
  defaultChildren?: () => JSX.Element;
}

/** Render one primitive Checkbox part with authored CSS hooks and native props. */
export function renderCheckboxNativePart<PrimitiveProps extends object>(
  options: NativePartOptions<PrimitiveProps>,
): JSX.Element {
  const [local, native] = splitProps(options.props, [
    'asChild',
    'ref',
    'class',
    'className',
    'unstyled',
    'children',
  ]);
  const primitiveProps = mergeProps(
    /** Forward changing native attributes without remounting the primitive. */
    () => native,
    /** Put any finite root choices on the part that consumes them. */
    () => options.attributes?.() ?? {},
    {
      /** Compose stable part, shared style, and consumer CSS hooks. */
      get class() {
        return composeRecipeClassNames(
          options.name,
          undefined,
          options.sharedClass,
          local.class,
          local.className,
        );
      },
      /** Suppress authored rules when either root or part opts out. */
      get 'data-unstyled'() {
        return options.presentation().unstyled || local.unstyled ? '' : undefined;
      },
      /** Keep the primitive state and both refs on a caller-owned part element. */
      get asChild() {
        const renderChild = local.asChild;
        if (!renderChild) return undefined;
        const childRenderer: RenderChild = renderChild;

        /** Bridge the primitive's live attributes to the caller's native child. */
        function renderNativeChild(getPrimitiveProps: PrimitivePartGetProps): JSX.Element {
          return renderCheckboxPartChild(childRenderer, local, getPrimitiveProps);
        }

        return renderNativeChild;
      },
      /** Forward the native part ref to the primitive. */
      get ref() {
        return local.ref;
      },
      /** Resolve default content inside the primitive's checkbox context. */
      get children() {
        return local.children ?? options.defaultChildren?.();
      },
    },
  );

  // The primitive's native part props are narrower than the checked polymorphic API.
  return createComponent(options.part as Component<typeof primitiveProps>, primitiveProps);
}
