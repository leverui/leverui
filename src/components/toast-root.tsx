import { splitProps } from '../primitives/utils/split-props';
import { Toast as PrimitiveToast } from '../primitives/components/toast';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { ToastRootProps } from './toast-props';
import type { ToastRenderProps } from './toast-render-props';

/** Keep the primitive's toast lifecycle while exposing native styling hooks. */
function ToastRootImpl(props: ToastRenderProps): JSX.Element {
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Read the caller-selected root tag when the primitive renders a child. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the current native root reference to the primitive. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive machine attributes and caller native props reactive. */
    () => native,
    /** Translate the supported HTML aliases on the native root. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve the caller's ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Expose the stable CSS hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('toast__root', undefined, local.class, local.className);
      },
      /** Suppress default CSS without changing lifecycle behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Preserve the caller-owned toast body. */
      get children() {
        return content.children;
      },
      /** Forward a caller-owned or selected native root. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(PrimitiveToast.Root as Component<typeof primitiveProps>, primitiveProps);
}

/** Expose native Toast root props and polymorphic rendering. */
export const ToastRoot = ToastRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ToastRootProps<As>,
) => JSX.Element;
