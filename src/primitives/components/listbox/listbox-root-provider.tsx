import { mergeProps } from '../../utils/merge-part-props';
import type { JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseListboxReturn } from './use-listbox';
import { ListboxProvider } from './use-listbox-context';
import type { CollectionItem } from '../collection/index';

interface RootProviderProps<T extends CollectionItem> {
  value: UseListboxReturn<T>;
}
export type ListboxRootProviderBaseProps<T extends CollectionItem> = RootProviderProps<T> &
  PolymorphicProps<'div'>;
export type ListboxRootProviderProps<T extends CollectionItem> = Assign<
  HTMLProps<'div'>,
  ListboxRootProviderBaseProps<T>
>;

/** Provide the Listbox root provider to its children. */
export const ListboxRootProvider = <T extends CollectionItem>(
  props: ListboxRootProviderProps<T>,
) => {
  const [{ value: listbox }, localProps] = createSplitProps<RootProviderProps<T>>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => listbox().getRootProps(), localProps);

  return (
    <ListboxProvider value={listbox}>
      <primitive.div {...mergedProps} />
    </ListboxProvider>
  );
};

export type ListboxRootProviderComponent<P = Record<never, never>> = <T extends CollectionItem>(
  props: Assign<ListboxRootProviderProps<T>, P>,
) => JSX.Element;
