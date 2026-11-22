import { splitProps } from '../primitives/utils/split-props';
import { Combobox as PrimitiveCombobox } from '../primitives/components/combobox';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  readComboboxPalette,
  readComboboxSize,
  readComboboxVariant,
  comboboxAppearanceAttributes,
  ComboboxAppearanceProvider,
  type ComboboxAppearance,
  type ComboboxAppearanceState,
} from './combobox-appearance';
import type { CollectionItem, UseComboboxReturn } from './combobox-machine';
import {
  useComboboxRootProps,
  useComboboxRootProviderProps,
  type ComboboxRootProps,
  type ComboboxRootProviderProps,
} from './combobox-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = NativeHtmlAliases &
  ComboboxAppearance & {
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeRootProviderProps = RuntimeRootProps & { value: UseComboboxReturn<CollectionItem> };
type RootRenderInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeRootProviderProps };

/** Reflect finite appearance while the primitive owns selection and native form state. */
function renderComboboxRoot(
  input: RootRenderInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveCombobox.Root : PrimitiveCombobox.RootProvider;
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const appearance: ComboboxAppearanceState = {
    /** Validate changing size choices before CSS sees them. */
    size: () => readComboboxSize(local.size),
    /** Validate changing treatment choices before CSS sees them. */
    variant: () => readComboboxVariant(local.variant),
    /** Keep named or consumer palettes reactive. */
    colorPalette: () => readComboboxPalette(local.colorPalette),
    /** Suppress authored presentation without changing the primitive behavior. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Expose the caller ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native and machine props without presentation style objects. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Bind finite selectors to server and client markup. */
    () => comboboxAppearanceAttributes(appearance),
    {
      /** Preserve the consumer ref on the default native root. */
      get ref() {
        return local.ref;
      },
      /** Keep the stable part hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('combobox__root', undefined, local.class, local.className);
      },
      /** Suppress authored root presentation when requested. */
      get 'data-unstyled'() {
        return appearance.unstyled() ? '' : undefined;
      },
      /** Keep compound parts under the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve a caller-rendered child or selected native root. */
      get asChild() {
        const child = local.asChild;
        if (child) return primitiveChildWithRef(child, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <ComboboxAppearanceProvider value={appearance}>
      {/* The mode union verifies provider.value before the primitive's generic boundary. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </ComboboxAppearanceProvider>
  );
}

/** Render a machine-owned Combobox after public generic inference. */
function ComboboxRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useComboboxRootProps(instance);
  return renderComboboxRoot({ mode: 'root', props: merged }, content);
}

/** Expose typed collection items and selected native root elements. */
export const ComboboxRoot = ComboboxRootImpl as <
  T extends CollectionItem,
  As extends PrimitiveNativeTag = 'div',
>(
  props: ComboboxRootProps<T, As>,
) => JSX.Element;

/** Name the generic public root component for compound API consumers. */
export type ComboboxRootComponent = typeof ComboboxRoot;

/** Render a Combobox driven by a caller-owned primitive machine accessor. */
function ComboboxRootProviderImpl(props: RuntimeRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useComboboxRootProviderProps(instance);
  return renderComboboxRoot({ mode: 'provider', props: merged }, content);
}

/** Require an external machine accessor and typed collection items. */
export const ComboboxRootProvider = ComboboxRootProviderImpl as <
  T extends CollectionItem,
  As extends PrimitiveNativeTag = 'div',
>(
  props: ComboboxRootProviderProps<T, As>,
) => JSX.Element;
