import { splitProps } from '../primitives/utils/split-props';
import { DatePicker as PrimitiveDatePicker } from '../primitives/components/date-picker';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  datePickerAppearanceAttributes,
  DatePickerAppearanceProvider,
  readDatePickerHideOutsideDays,
  readDatePickerPalette,
  readDatePickerSize,
  readDatePickerVariant,
  type DatePickerAppearanceState,
} from './date-picker-appearance';
import {
  useDatePickerRootProps,
  useDatePickerRootProviderProps,
  type DatePickerRootProps,
  type DatePickerRootProviderProps,
} from './date-picker-props';
import type {
  DatePickerRuntimeProviderProps,
  DatePickerRuntimeRootProps,
} from './date-picker-runtime-props';

type RootInput =
  | { mode: 'root'; props: DatePickerRuntimeRootProps }
  | { mode: 'provider'; props: DatePickerRuntimeProviderProps };

/** Reflect finite presentation while the primitive owns the date machine. */
function renderDatePickerRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveDatePicker.Root : PrimitiveDatePicker.RootProvider;
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'hideOutsideDays',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const appearance: DatePickerAppearanceState = {
    /** Validate changing size choices before CSS sees them. */
    size: () => readDatePickerSize(local.size),
    /** Validate changing field treatments before CSS sees them. */
    variant: () => readDatePickerVariant(local.variant),
    /** Keep calendar outside-day visibility reactive. */
    hideOutsideDays: () => readDatePickerHideOutsideDays(local.hideOutsideDays),
    /** Scope named and custom palettes across portals. */
    colorPalette: () => readDatePickerPalette(local.colorPalette),
    /** Suppress authored presentation without changing the primitive state. */
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
    /** Forward native, presence, and date-machine props. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Bind finite selectors to server and client markup. */
    () => datePickerAppearanceAttributes(appearance),
    {
      /** Preserve the consumer ref on the default native root. */
      get ref() {
        return local.ref;
      },
      /** Keep a stable part hook beside consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'date-picker__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored root presentation when requested. */
      get 'data-unstyled'() {
        return appearance.unstyled() ? '' : undefined;
      },
      /** Keep the compound parts under the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve caller-rendered children or selected native roots. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <DatePickerAppearanceProvider value={appearance}>
      {/* The mode union verifies provider.value before the primitive's generic boundary. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </DatePickerAppearanceProvider>
  );
}

/** Render a DatePicker with its own primitive and Zag machine. */
function DatePickerRootImpl(props: DatePickerRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDatePickerRoot({ mode: 'root', props: useDatePickerRootProps(instance) }, content);
}

/** Expose typed native root element selection. */
export const DatePickerRoot = DatePickerRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: DatePickerRootProps<As>,
) => JSX.Element;

/** Render a DatePicker around a caller-owned primitive machine. */
function DatePickerRootProviderImpl(props: DatePickerRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderDatePickerRoot(
    { mode: 'provider', props: useDatePickerRootProviderProps(instance) },
    content,
  );
}

/** Require an external machine accessor and native root props. */
export const DatePickerRootProvider = DatePickerRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: DatePickerRootProviderProps<As>,
) => JSX.Element;
