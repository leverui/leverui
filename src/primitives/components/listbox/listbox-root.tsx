import type { JSX } from '@solidjs/web';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import type { CollectionItem } from '../collection/index';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseListboxProps, useListbox } from './use-listbox';
import { ListboxProvider } from './use-listbox-context';

export type ListboxRootBaseProps<T extends CollectionItem> = UseListboxProps<T> &
  PolymorphicProps<'div'>;
export type ListboxRootProps<T extends CollectionItem> = Assign<
  HTMLProps<'div'>,
  ListboxRootBaseProps<T>
>;

/** Render the Listbox root. */
export const ListboxRoot = <T extends CollectionItem>(props: ListboxRootProps<T>) => {
  const [useListboxProps, localProps] = createSplitProps<UseListboxProps<T>>()(props, [
    'collection',
    'defaultHighlightedValue',
    'defaultValue',
    'deselectable',
    'disabled',
    'disallowSelectAll',
    'highlightedValue',
    'id',
    'ids',
    'loopFocus',
    'onHighlightChange',
    'onSelect',
    'onValueChange',
    'orientation',
    'scrollToIndexFn',
    'selectionMode',
    'selectOnHighlight',
    'typeahead',
    'value',
  ]);

  const listbox = useListbox(useListboxProps);
  const mergedProps = mergeProps(() => listbox().getRootProps(), localProps);

  return (
    <ListboxProvider value={listbox}>
      <primitive.div {...mergedProps} />
    </ListboxProvider>
  );
};

export type ListboxRootComponentProps<
  T extends CollectionItem = CollectionItem,
  P = Record<never, never>,
> = Assign<ListboxRootProps<T>, P>;

export type ListboxRootComponent<P = Record<never, never>> = <T extends CollectionItem>(
  props: ListboxRootComponentProps<T, P>,
) => JSX.Element;
