import type { RootState } from '@zag-js/select';
import { mergeProps } from '../../utils/merge-part-props';
import type { JSX } from '@solidjs/web';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import type { CollectionItem } from '../collection/index';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UseSelectReturn } from './use-select';
import { SelectProvider } from './use-select-context';

interface RootProviderProps<T extends CollectionItem> {
  value: UseSelectReturn<T>;
}

export type SelectRootProviderState = RootState;

export type SelectRootProviderBaseProps<T extends CollectionItem> = RootProviderProps<T> &
  UsePresenceProps &
  PolymorphicProps<'div', SelectRootProviderState>;
export type SelectRootProviderProps<T extends CollectionItem> = Assign<
  HTMLProps<'div'>,
  SelectRootProviderBaseProps<T>
>;

/** Provide the Select root provider to its children. */
export const SelectRootProvider = <T extends CollectionItem>(props: SelectRootProviderProps<T>) => {
  const [presenceProps, selectProps] = splitPresenceProps(props);
  const [{ value: select }, localProps] = createSplitProps<RootProviderProps<T>>()(selectProps, [
    'value',
  ]);
  const presence = usePresence(mergeProps(() => ({ present: select().open }), presenceProps));
  const mergedProps = mergeProps(() => select().getRootProps(), localProps);

  return (
    <SelectProvider value={select}>
      <PresenceProvider value={presence}>
        <primitive.div {...mergedProps} state={select().getRootState()} />
      </PresenceProvider>
    </SelectProvider>
  );
};

export type SelectRootProviderComponent<P = Record<never, never>> = <T extends CollectionItem>(
  props: Assign<SelectRootProviderProps<T>, P>,
) => JSX.Element;
