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
import { type UseComboboxProps, useCombobox } from './use-combobox';
import { ComboboxProvider } from './use-combobox-context';

export type ComboboxRootState = RootState;

export type ComboboxRootBaseProps<T extends CollectionItem> = UseComboboxProps<T> &
  UsePresenceProps &
  PolymorphicProps<'div', ComboboxRootState>;

export type ComboboxRootProps<T extends CollectionItem> = Assign<
  Omit<HTMLProps<'div'>, 'onSelect'>,
  ComboboxRootBaseProps<T>
>;

/** Render the Combobox root. */
export const ComboboxRoot = <T extends CollectionItem>(props: ComboboxRootProps<T>) => {
  const [presenceProps, comboboxProps] = splitPresenceProps(props);
  const [useComboboxProps, localProps] = createSplitProps<UseComboboxProps<T>>()(comboboxProps, [
    'allowCustomValue',
    'alwaysSubmitOnEnter',
    'autoFocus',
    'closeOnSelect',
    'collection',
    'defaultHighlightedValue',
    'defaultInputValue',
    'defaultOpen',
    'defaultValue',
    'disabled',
    'loading',
    'inline',
    'form',
    'highlightedValue',
    'id',
    'ids',
    'inputBehavior',
    'inputValue',
    'invalid',
    'loopFocus',
    'multiple',
    'name',
    'navigate',
    'onFocusOutside',
    'onHighlightChange',
    'onInputValueChange',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onValueChange',
    'onSelect',
    'open',
    'openOnChange',
    'openOnClick',
    'openOnKeyPress',
    'placeholder',
    'popupType',
    'positioning',
    'readOnly',
    'required',
    'scrollToIndexFn',
    'selectionBehavior',
    'translations',
    'value',
  ]);

  const api = useCombobox(useComboboxProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <ComboboxProvider value={api}>
      <PresenceProvider value={apiPresence}>
        <primitive.div {...mergedProps} state={api().getRootState()} />
      </PresenceProvider>
    </ComboboxProvider>
  );
};

export type ComboboxRootComponentProps<
  T extends CollectionItem = CollectionItem,
  P = Record<never, never>,
> = Assign<ComboboxRootProps<T>, P>;

export type ComboboxRootComponent<P = Record<never, never>> = <T extends CollectionItem>(
  props: ComboboxRootComponentProps<T, P>,
) => JSX.Element;
