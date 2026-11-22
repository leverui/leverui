import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ListboxAppearance } from './listbox-appearance';
import type { CollectionItem, UseListboxProps, UseListboxReturn } from './listbox-machine';
import { mergeRecipeProps } from './recipe-props-merge';

export type ListboxRootBaseProps<T extends CollectionItem = CollectionItem> = UseListboxProps<T> &
  ListboxAppearance;
export type ListboxRootProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  ListboxRootBaseProps<T> & NativeHtmlAliases & { className?: string },
  As
>;
export type ListboxRootProviderProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  { value: UseListboxReturn<T> } & ListboxAppearance & NativeHtmlAliases & { className?: string },
  As
>;

export interface ListboxPropsProviderProps<T extends CollectionItem = CollectionItem> {
  value: Partial<ListboxRootBaseProps<T>> | Accessor<Partial<ListboxRootBaseProps<T>>>;
  children: JSX.Element;
}

const ListboxPropsContext = createOptionalContext<Accessor<object>>();

/** Supply reactive machine and appearance defaults to nested Listbox roots. */
export function ListboxPropsProvider<T extends CollectionItem>(
  props: ListboxPropsProviderProps<T>,
): JSX.Element {
  /** Read changing defaults without owning a descendant machine. */
  function readDefaults(): object {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ListboxPropsContext value={readDefaults}>{props.children}</ListboxPropsContext>;
}

/** Merge inherited defaults before one machine-owned Listbox root. */
export function useListboxRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ListboxPropsContext);
  return mergeRecipeProps<Props>(
    /** Follow the provider accessor while preserving the caller's item type. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Inherit appearance without replacing a caller-owned Listbox machine. */
export function useListboxRootProviderProps<
  Props extends ListboxAppearance & { value: UseListboxReturn<CollectionItem> },
>(instance: Props): Props {
  const inherited = useOptionalContext(ListboxPropsContext);
  return mergeRecipeProps<Props>(
    /** Keep selection, collection, and event defaults off the external store. */
    () => {
      const defaults = (inherited?.() ?? {}) as Partial<ListboxAppearance>;
      return {
        variant: defaults.variant,
        colorPalette: defaults.colorPalette,
        unstyled: defaults.unstyled,
      } as Partial<Props>;
    },
    instance,
  );
}
