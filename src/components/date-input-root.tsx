import { splitProps } from '../primitives/utils/split-props';
import { DateInput as PrimitiveDateInput } from '../primitives/components/date-input';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  dateInputAppearanceAttributes,
  DateInputAppearanceProvider,
  readDateInputPalette,
  readDateInputSize,
  readDateInputVariant,
  type DateInputAppearanceState,
} from './date-input-appearance';
import {
  useDateInputRootProps,
  useDateInputRootProviderProps,
  type DateInputRootProps,
  type DateInputRootProviderProps,
} from './date-input-props';
import type {
  DateInputRuntimeProviderProps,
  DateInputRuntimeRootProps,
} from './date-input-runtime-props';

type RootInput =
  | { mode: 'root'; props: DateInputRuntimeRootProps }
  | { mode: 'provider'; props: DateInputRuntimeProviderProps };

/** Reflect authored appearance while the primitive owns date editing and form state. */
function renderDateInputRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveDateInput.Root : PrimitiveDateInput.RootProvider;
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
  const appearance: DateInputAppearanceState = {
    /** Keep changing finite sizes visible to the stylesheet. */
    size: () => readDateInputSize(local.size),
    /** Keep changing finite variants visible to the stylesheet. */
    variant: () => readDateInputVariant(local.variant),
    /** Keep a caller's color palette reactive. */
    colorPalette: () => readDateInputPalette(local.colorPalette),
    /** Suppress authored presentation without changing date behavior. */
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
    /** Forward native and date-machine props without style extraction. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Bind finite choices to server and client markup. */
    () => dateInputAppearanceAttributes(appearance),
    {
      /** Preserve the caller ref on the default native root. */
      get ref() {
        return local.ref;
      },
      /** Compose the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('date-input__root', undefined, local.class, local.className);
      },
      /** Suppress authored root presentation when requested. */
      get 'data-unstyled'() {
        return appearance.unstyled() ? '' : undefined;
      },
      /** Keep segments beneath the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve a caller-owned child or selected native root. */
      get asChild() {
        const child = local.asChild;
        if (child) return primitiveChildWithRef(child, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <DateInputAppearanceProvider value={appearance}>
      {/* The mode union verifies provider.value before the primitive's boundary. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </DateInputAppearanceProvider>
  );
}

/** Render DateInput with its own primitive and Zag machine. */
function DateInputRootImpl(props: DateInputRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDateInputRoot({ mode: 'root', props: useDateInputRootProps(instance) }, content);
}

/** Expose a typed DateInput root with native element selection. */
export const DateInputRoot = DateInputRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: DateInputRootProps<As>,
) => JSX.Element;

/** Render DateInput around a caller-owned primitive date machine. */
function DateInputRootProviderImpl(props: DateInputRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDateInputRoot(
    { mode: 'provider', props: useDateInputRootProviderProps(instance) },
    content,
  );
}

/** Require the caller's date machine accessor on the provider root. */
export const DateInputRootProvider = DateInputRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: DateInputRootProviderProps<As>,
) => JSX.Element;
