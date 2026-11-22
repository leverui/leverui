import { splitProps } from '../primitives/utils/split-props';
import { Toggle as PrimitiveToggle } from '../primitives/components/toggle';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useToggleRootProps, type ToggleRootProps } from './toggle-props';
import type { ToggleRuntimeRootProps } from './toggle-runtime-props';

/** Bind the public CSS hook to the primitive's pressed-state button. */
function ToggleRootImpl(props: ToggleRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useToggleRootProps(instance);
  const [local, rest] = splitProps(merged, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'button';
  }

  /** Expose the caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine and native props reactive. */
    () => rest,
    /** Translate native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    {
      /** Retain the caller ref on the default button. */
      get ref() {
        return local.ref;
      },
      /** Combine the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('toggle__root', undefined, local.class, local.className);
      },
      /** Suppress authored presentation without leaking the prop to HTML. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Build child parts under the primitive's machine context. */
      get children() {
        return content.children;
      },
      /** Preserve a caller-owned child or selected native element. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'button'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(PrimitiveToggle.Root as Component<typeof primitiveProps>, primitiveProps);
}

/** Expose typed native, selected-tag, and child Toggle roots. */
export const ToggleRoot = ToggleRootImpl as <As extends PrimitiveNativeTag = 'button'>(
  props: ToggleRootProps<As>,
) => JSX.Element;
