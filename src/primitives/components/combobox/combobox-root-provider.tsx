import type { RootState } from '@zag-js/combobox';
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
import type { UseComboboxReturn } from './use-combobox';
import { ComboboxProvider } from './use-combobox-context';

interface RootProviderProps<T extends CollectionItem> {
  value: UseComboboxReturn<T>;
}

export type ComboboxRootProviderState = RootState;

export type ComboboxRootProviderBaseProps<T extends CollectionItem> = RootProviderProps<T> &
  UsePresenceProps &
  PolymorphicProps<'div', ComboboxRootProviderState>;
export type ComboboxRootProviderProps<T extends CollectionItem> = Assign<
  HTMLProps<'div'>,
  ComboboxRootProviderBaseProps<T>
>;

/** Provide the Combobox root provider to its children. */
export const ComboboxRootProvider = <T extends CollectionItem>(
  props: ComboboxRootProviderProps<T>,
) => {
  const [presenceProps, comboboxProps] = splitPresenceProps(props);
  const [{ value: combobox }, localProps] = createSplitProps<RootProviderProps<T>>()(
    comboboxProps,
    ['value'],
  );

  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: combobox().open })));
  const mergedProps = mergeProps(() => combobox().getRootProps(), localProps);

  return (
    <ComboboxProvider value={combobox}>
      <PresenceProvider value={apiPresence}>
        <primitive.div {...mergedProps} state={combobox().getRootState()} />
      </PresenceProvider>
    </ComboboxProvider>
  );
};

export type ComboboxRootProviderComponent<P = Record<never, never>> = <T extends CollectionItem>(
  props: Assign<ComboboxRootProviderProps<T>, P>,
) => JSX.Element;
