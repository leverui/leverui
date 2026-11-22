import { splitProps } from '../primitives/utils/split-props';
import { Listbox as PrimitiveListbox } from '../primitives/components/listbox';
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
  listboxAppearanceAttributes,
  ListboxAppearanceProvider,
  readListboxPalette,
  readListboxVariant,
  type ListboxAppearance,
  type ListboxAppearanceState,
} from './listbox-appearance';
import type { CollectionItem, UseListboxReturn } from './listbox-machine';
import {
  useListboxRootProps,
  useListboxRootProviderProps,
  type ListboxRootProps,
  type ListboxRootProviderProps,
} from './listbox-props';
import type { ClassValue } from '../utils/class-value';
type RuntimeRootProps = NativeHtmlAliases &
  ListboxAppearance & {
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeRootProviderProps = RuntimeRootProps & { value: UseListboxReturn<CollectionItem> };
type RootRenderInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeRootProviderProps };

/** Reflect finite appearance while the primitive owns selection and navigation. */
function renderListboxRoot(
  input: RootRenderInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveListbox.Root : PrimitiveListbox.RootProvider;
  const [local, native] = splitProps(props, [
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
  const appearance: ListboxAppearanceState = {
    /** Keep a changing variant visible to authored CSS. */
    variant: () => readListboxVariant(local.variant),
    /** Keep named or consumer palettes reactive. */
    colorPalette: () => readListboxPalette(local.colorPalette),
    /** Suppress authored presentation without changing selection. */
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
    /** Forward native and machine props without style extraction. */
    () => native,
    /** Convert Lever UI native aliases before rendering the primitive's root. */
    () => nativeHtmlAttributes(local),
    /** Bind the finite variant to server and client markup. */
    () => listboxAppearanceAttributes(appearance),
    {
      /** Preserve the consumer ref on the default native root. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with caller classes. */
      get class() {
        return composeRecipeClassNames('listbox__root', undefined, local.class, local.className);
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
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <ListboxAppearanceProvider value={appearance}>
      {/* The mode union verifies provider.value before the primitive's generic boundary. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </ListboxAppearanceProvider>
  );
}

/** Render a machine-owned Listbox after public generic inference. */
function ListboxRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useListboxRootProps(instance);
  return renderListboxRoot({ mode: 'root', props: merged }, content);
}

/** Expose typed collection items and selected native root elements. */
export const ListboxRoot = ListboxRootImpl as <
  T extends CollectionItem,
  As extends PrimitiveNativeTag = 'div',
>(
  props: ListboxRootProps<T, As>,
) => JSX.Element;

/** Name the generic public root component for compound API consumers. */
export type ListboxRootComponent = typeof ListboxRoot;

/** Render a Listbox driven by a caller-owned primitive machine accessor. */
function ListboxRootProviderImpl(props: RuntimeRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useListboxRootProviderProps(instance);
  return renderListboxRoot({ mode: 'provider', props: merged }, content);
}

/** Require an external machine accessor and typed collection items. */
export const ListboxRootProvider = ListboxRootProviderImpl as <
  T extends CollectionItem,
  As extends PrimitiveNativeTag = 'div',
>(
  props: ListboxRootProviderProps<T, As>,
) => JSX.Element;
