import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { SelectAppearance } from './select-appearance';
import type { CollectionItem, UseSelectProps, UseSelectReturn } from './select-machine';
import { mergeRecipeProps } from './recipe-props-merge';

type SelectMachineProps<T extends CollectionItem> = UseSelectProps<T> & UsePresenceProps;

export type SelectRootBaseProps<T extends CollectionItem = CollectionItem> = SelectMachineProps<T> &
  SelectAppearance;
export type SelectRootProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  SelectRootBaseProps<T> & NativeHtmlAliases & { className?: string },
  As
>;
export type SelectRootProviderProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  { value: UseSelectReturn<T> } & UsePresenceProps &
    SelectAppearance &
    NativeHtmlAliases & { className?: string },
  As
>;

export interface SelectPropsProviderProps<T extends CollectionItem = CollectionItem> {
  value: Partial<SelectRootBaseProps<T>> | Accessor<Partial<SelectRootBaseProps<T>>>;
  children: JSX.Element;
}

const SelectPropsContext = createOptionalContext<Accessor<object>>();

/** Supply reactive machine and appearance defaults to nested Select roots. */
export function SelectPropsProvider<T extends CollectionItem>(
  props: SelectPropsProviderProps<T>,
): JSX.Element {
  /** Read current defaults without owning a Select machine. */
  function readDefaults(): object {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <SelectPropsContext value={readDefaults}>{props.children}</SelectPropsContext>;
}

/** Merge inherited defaults before one machine-owned Select root. */
export function useSelectRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(SelectPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep instance machine props after inherited defaults. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Inherit appearance without replacing a caller-owned Select machine. */
export function useSelectRootProviderProps<
  Props extends SelectAppearance & { value: UseSelectReturn<CollectionItem> },
>(instance: Props): Props {
  const inherited = useOptionalContext(SelectPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep collection, selection, and events on the external machine. */
    () => {
      const defaults = (inherited?.() ?? {}) as Partial<SelectAppearance>;
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
