import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ComboboxAppearance } from './combobox-appearance';
import type { CollectionItem, UseComboboxProps, UseComboboxReturn } from './combobox-machine';
import { mergeRecipeProps } from './recipe-props-merge';

type ComboboxMachineProps<T extends CollectionItem> = UseComboboxProps<T> & UsePresenceProps;

export type ComboboxRootBaseProps<T extends CollectionItem = CollectionItem> =
  ComboboxMachineProps<T> & ComboboxAppearance;
export type ComboboxRootProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  ComboboxRootBaseProps<T> & NativeHtmlAliases & { className?: string },
  As
>;
export type ComboboxRootProviderProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  { value: UseComboboxReturn<T> } & UsePresenceProps &
    ComboboxAppearance &
    NativeHtmlAliases & { className?: string },
  As
>;

export interface ComboboxPropsProviderProps<T extends CollectionItem = CollectionItem> {
  value: Partial<ComboboxRootBaseProps<T>> | Accessor<Partial<ComboboxRootBaseProps<T>>>;
  children: JSX.Element;
}

const ComboboxPropsContext = createOptionalContext<Accessor<object>>();

/** Supply reactive machine and appearance defaults to nested Combobox roots. */
export function ComboboxPropsProvider<T extends CollectionItem>(
  props: ComboboxPropsProviderProps<T>,
): JSX.Element {
  /** Read current defaults without owning a Combobox machine. */
  function readDefaults(): object {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <ComboboxPropsContext value={readDefaults}>{props.children}</ComboboxPropsContext>;
}

/** Merge inherited defaults before one machine-owned Combobox root. */
export function useComboboxRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ComboboxPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep instance machine props after inherited defaults. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Inherit appearance without replacing a caller-owned Combobox machine. */
export function useComboboxRootProviderProps<
  Props extends ComboboxAppearance & { value: UseComboboxReturn<CollectionItem> },
>(instance: Props): Props {
  const inherited = useOptionalContext(ComboboxPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep collection, selection, and events on the external machine. */
    () => {
      const defaults = (inherited?.() ?? {}) as Partial<ComboboxAppearance>;
      return {
        size: defaults.size,
        variant: defaults.variant,
        colorPalette: defaults.colorPalette,
        unstyled: defaults.unstyled,
      } as Partial<Props>;
    },
    instance,
  );
}
