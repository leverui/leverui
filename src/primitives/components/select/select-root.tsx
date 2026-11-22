import type { RootState } from '@zag-js/select';
import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
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
import { type UseSelectProps, useSelect } from './use-select';
import { SelectProvider } from './use-select-context';

export type SelectRootState = RootState;

export type SelectRootBaseProps<T extends CollectionItem> = UseSelectProps<T> &
  UsePresenceProps &
  PolymorphicProps<'div', SelectRootState>;
export type SelectRootProps<T extends CollectionItem> = Assign<
  HTMLProps<'div'>,
  SelectRootBaseProps<T>
>;

/** Render the Select root. */
export const SelectRoot = <T extends CollectionItem>(props: SelectRootProps<T>) => {
  const [presenceProps, selectProps] = splitPresenceProps(props);
  const [useSelectProps, localProps] = createSplitProps<UseSelectProps<T>>()(selectProps, [
    'alignItemWithTrigger',
    'autoComplete',
    'closeOnSelect',
    'collection',
    'defaultHighlightedValue',
    'defaultOpen',
    'defaultValue',
    'deselectable',
    'disabled',
    'form',
    'highlightedValue',
    'id',
    'ids',
    'initialFocusEl',
    'invalid',
    'loopFocus',
    'multiple',
    'name',
    'onFocusOutside',
    'onHighlightChange',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onSelect',
    'onValueChange',
    'open',
    'popupType',
    'positioning',
    'readOnly',
    'required',
    'scrollToIndexFn',
    'translations',
    'value',
  ]);

  const select = useSelect(useSelectProps);
  const presenceApi = usePresence(mergeProps(() => ({ present: select().open }), presenceProps));
  const mergedProps = mergeProps(() => select().getRootProps(), localProps);

  return (
    <SelectProvider value={select}>
      <PresenceProvider value={presenceApi}>
        <primitive.div {...mergedProps} state={select().getRootState()} />
      </PresenceProvider>
    </SelectProvider>
  );
};

export type SelectRootComponentProps<
  T extends CollectionItem = CollectionItem,
  P = Record<never, never>,
> = Assign<SelectRootProps<T>, P>;

export type SelectRootComponent<P = Record<never, never>> = <T extends CollectionItem>(
  props: SelectRootComponentProps<T, P>,
) => JSX.Element;
