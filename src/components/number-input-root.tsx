import { splitProps } from '../primitives/utils/split-props';
import { NumberInput as PrimitiveNumberInput } from '../primitives/components/number-input';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  NumberInputAppearanceProvider,
  numberInputAppearanceAttributes,
  type NumberInputAppearanceState,
} from './number-input-appearance';
import type { NumberInputRootProps, NumberInputRootProviderProps } from './number-input-props';
import { useNumberInputRootProps, useNumberInputRootProviderProps } from './number-input-props';
import type {
  NumberInputRuntimeProviderProps,
  NumberInputRuntimeRootProps,
} from './number-input-runtime-props';

const rootParts = {
  root: PrimitiveNumberInput.Root,
  provider: PrimitiveNumberInput.RootProvider,
} as const;
type RootMode = keyof typeof rootParts;

/** Require machine-owned props when rendering the internal primitive root. */
function renderNumberInputRoot(
  mode: 'root',
  props: NumberInputRuntimeRootProps,
  content: { children?: JSX.Element },
): JSX.Element;
/** Require a caller-owned machine when rendering the primitive's root provider. */
function renderNumberInputRoot(
  mode: 'provider',
  props: NumberInputRuntimeProviderProps,
  content: { children?: JSX.Element },
): JSX.Element;
/** Bind finite appearance and native props to one primitive Number Input root. */
function renderNumberInputRoot(
  mode: RootMode,
  props: NumberInputRuntimeRootProps | NumberInputRuntimeProviderProps,
  content: { children?: JSX.Element },
): JSX.Element {
  const part = rootParts[mode];
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
  ]);
  const attributes = createMemo(
    /** Keep responsive size and treatment attributes live. */
    () => numberInputAppearanceAttributes(local),
  );
  const appearance: NumberInputAppearanceState = {
    attributes,
    /** Suppress each part's default presentation when the root is unstyled. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Expose the caller ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine and native attributes reactive. */
    () => native,
    /** Apply finite responsive choices to the root. */
    () => attributes(),
    {
      /** Preserve callback refs on the default root. */
      get ref() {
        return local.ref;
      },
      /** Keep a stable class for consumer CSS. */
      get class() {
        return composeRecipeClassNames(
          'number-input__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Scope the semantic palette to all numeric parts. */
      get 'data-leverui-color-palette'() {
        return local.colorPalette;
      },
      /** Let authored CSS suppress the root presentation. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep compound parts under the appearance and machine contexts. */
      get children() {
        return content.children;
      },
      /** Preserve a selected child or native element. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <NumberInputAppearanceProvider value={appearance}>
      {/* The primitive's mixed root signatures need one call-site cast. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </NumberInputAppearanceProvider>
  );
}

/** Handle checked machine props after public polymorphic inference. */
function NumberInputRootImpl(props: NumberInputRuntimeRootProps): JSX.Element {
  const [content, ownProps] = splitProps(props, ['children']);
  return renderNumberInputRoot('root', useNumberInputRootProps(ownProps), content);
}

/** Expose selected native root props while checking the internal implementation. */
export const NumberInputRoot = NumberInputRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: NumberInputRootProps<As>,
) => JSX.Element;

/** Handle the caller-owned machine after public polymorphic inference. */
function NumberInputRootProviderImpl(props: NumberInputRuntimeProviderProps): JSX.Element {
  const [content, ownProps] = splitProps(props, ['children']);
  return renderNumberInputRoot('provider', useNumberInputRootProviderProps(ownProps), content);
}

/** Expose selected provider props while requiring an external machine. */
export const NumberInputRootProvider = NumberInputRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: NumberInputRootProviderProps<As>,
) => JSX.Element;
