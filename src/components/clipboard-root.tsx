import { splitProps } from '../primitives/utils/split-props';
import { Clipboard as PrimitiveClipboard } from '../primitives/components/clipboard';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { ClipboardAppearanceProvider, type ClipboardAppearanceState } from './clipboard-appearance';
import type { UseClipboardReturn } from './clipboard-machine';
import {
  useClipboardRootProps,
  useClipboardRootProviderProps,
  type ClipboardRootProps,
  type ClipboardRootProviderProps,
} from './clipboard-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type RuntimeProviderProps = RuntimeRootProps & { value: UseClipboardReturn };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Bind native attributes and the unstyled scope to either primitive root mode. */
function renderClipboardRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveClipboard.Root : PrimitiveClipboard.RootProvider;
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const appearance: ClipboardAppearanceState = {
    /** Keep descendants in sync with the root's presentation choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine and native attributes reactive. */
    () => native,
    {
      /** Preserve the consumer ref on the default root. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('clipboard__root', undefined, local.class, local.className);
      },
      /** Suppress authored presentation without changing copy behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Mount parts under the nearest primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve selected and caller-owned root elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <ClipboardAppearanceProvider value={appearance}>
      {/* The primitive's two root signatures meet at this native adapter. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </ClipboardAppearanceProvider>
  );
}

/** Render a Clipboard with its own primitive and Zag state machine. */
function ClipboardRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderClipboardRoot({ mode: 'root', props: useClipboardRootProps(instance) }, content);
}

/** Expose a typed Clipboard root with native element selection. */
export const ClipboardRoot = ClipboardRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ClipboardRootProps<As>,
) => JSX.Element;

/** Render a Clipboard around a caller-owned primitive machine. */
function ClipboardRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderClipboardRoot(
    { mode: 'provider', props: useClipboardRootProviderProps(instance) },
    content,
  );
}

/** Require the caller's Clipboard machine accessor. */
export const ClipboardRootProvider = ClipboardRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: ClipboardRootProviderProps<As>,
) => JSX.Element;
