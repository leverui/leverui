import { splitProps } from '../primitives/utils/split-props';
import { Select as PrimitiveSelect } from '../primitives/components/select';
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
  readSelectPalette,
  readSelectSize,
  readSelectVariant,
  selectAppearanceAttributes,
  SelectAppearanceProvider,
  type SelectAppearance,
  type SelectAppearanceState,
} from './select-appearance';
import type { CollectionItem, UseSelectReturn } from './select-machine';
import {
  useSelectRootProps,
  useSelectRootProviderProps,
  type SelectRootProps,
  type SelectRootProviderProps,
} from './select-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = NativeHtmlAliases &
  SelectAppearance & {
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeRootProviderProps = RuntimeRootProps & { value: UseSelectReturn<CollectionItem> };
type RootRenderInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeRootProviderProps };

/** Reflect finite appearance while the primitive owns selection and native form state. */
function renderSelectRoot(
  input: RootRenderInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveSelect.Root : PrimitiveSelect.RootProvider;
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
  const appearance: SelectAppearanceState = {
    /** Validate changing size choices before CSS sees them. */
    size: () => readSelectSize(local.size),
    /** Validate changing treatment choices before CSS sees them. */
    variant: () => readSelectVariant(local.variant),
    /** Keep named or consumer palettes reactive. */
    colorPalette: () => readSelectPalette(local.colorPalette),
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
    () => selectAppearanceAttributes(appearance),
    {
      /** Preserve the consumer ref on the default native root. */
      get ref() {
        return local.ref;
      },
      /** Keep the stable part hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('select__root', undefined, local.class, local.className);
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
    <SelectAppearanceProvider value={appearance}>
      {/* The mode union verifies provider.value before the primitive's generic boundary. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </SelectAppearanceProvider>
  );
}

/** Render a machine-owned Select after public generic inference. */
function SelectRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSelectRootProps(instance);
  const positioned = mergeProps({ positioning: { sameWidth: true } }, merged);
  return renderSelectRoot({ mode: 'root', props: positioned }, content);
}

/** Expose typed collection items and selected native root elements. */
export const SelectRoot = SelectRootImpl as <
  T extends CollectionItem,
  As extends PrimitiveNativeTag = 'div',
>(
  props: SelectRootProps<T, As>,
) => JSX.Element;

/** Name the generic public root component for compound API consumers. */
export type SelectRootComponent = typeof SelectRoot;

/** Render a Select driven by a caller-owned primitive machine accessor. */
function SelectRootProviderImpl(props: RuntimeRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSelectRootProviderProps(instance);
  return renderSelectRoot({ mode: 'provider', props: merged }, content);
}

/** Require an external machine accessor and typed collection items. */
export const SelectRootProvider = SelectRootProviderImpl as <
  T extends CollectionItem,
  As extends PrimitiveNativeTag = 'div',
>(
  props: SelectRootProviderProps<T, As>,
) => JSX.Element;
