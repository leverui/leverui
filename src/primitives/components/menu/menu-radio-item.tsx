import type { Assign } from '../../types';
import type { OptionItemProps, OptionItemState } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { MenuItemProvider } from './use-menu-item-context';
import { useMenuItemGroupContext } from './use-menu-item-group-context';
import { MenuItemPropsProvider } from './use-menu-option-item-props-context';

type PartialOptionItemProps = Omit<OptionItemProps, 'type' | 'checked' | 'onCheckedChange'>;

export type MenuRadioItemState = OptionItemState;

export type MenuRadioItemBaseProps = PartialOptionItemProps &
  PolymorphicProps<'div', MenuRadioItemState>;
export type MenuRadioItemProps = Assign<HTMLProps<'div'>, MenuRadioItemBaseProps>;

/** Render the Menu radio item. */
export const MenuRadioItem = (props: MenuRadioItemProps) => {
  const [partialItemProps, localProps] = createSplitProps<PartialOptionItemProps>()(props, [
    'closeOnSelect',
    'disabled',
    'value',
    'valueText',
  ]);
  const context = useMenuContext();
  const itemGroup = useMenuItemGroupContext();
  const optionItemProps = mergeProps(partialItemProps, () => ({
    type: 'radio',
    checked: itemGroup.value === partialItemProps.value,
    /** Handle checked change. */
    onCheckedChange: () => itemGroup.onValueChange?.({ value: partialItemProps.value }),
  })) as OptionItemProps;

  const mergedProps = mergeProps(() => context().getOptionItemProps(optionItemProps), localProps);
  const optionItemState = createMemo(() => context().getOptionItemState(optionItemProps));

  return (
    <MenuItemPropsProvider value={optionItemProps}>
      <MenuItemProvider value={optionItemState}>
        <primitive.div {...mergedProps} state={context().getOptionItemState(optionItemProps)} />
      </MenuItemProvider>
    </MenuItemPropsProvider>
  );
};
