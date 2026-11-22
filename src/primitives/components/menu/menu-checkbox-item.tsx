import type { Assign } from '../../types';
import type { OptionItemProps, OptionItemState } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { MenuItemProvider } from './use-menu-item-context';
import { MenuItemPropsProvider } from './use-menu-option-item-props-context';

type PartialOptionItemProps = Omit<OptionItemProps, 'type'>;

export type MenuCheckboxItemState = OptionItemState;

export type MenuCheckboxItemBaseProps = PartialOptionItemProps &
  PolymorphicProps<'div', MenuCheckboxItemState>;
export type MenuCheckboxItemProps = Assign<HTMLProps<'div'>, MenuCheckboxItemBaseProps>;

/** Render the Menu checkbox item. */
export const MenuCheckboxItem = (props: MenuCheckboxItemProps) => {
  const [partialOptionItemProps, localProps] = createSplitProps<PartialOptionItemProps>()(props, [
    'checked',
    'closeOnSelect',
    'disabled',
    'onCheckedChange',
    'value',
    'valueText',
  ]);
  const optionItemProps = mergeProps(partialOptionItemProps, {
    type: 'checkbox',
  }) as OptionItemProps;

  const context = useMenuContext();
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
