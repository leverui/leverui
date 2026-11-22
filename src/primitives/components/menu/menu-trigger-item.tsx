import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuTriggerItemContext } from './use-menu-trigger-item-context';
import { MenuItemPropsProvider } from './use-menu-option-item-props-context';

export type MenuTriggerItemBaseProps = PolymorphicProps<'div'>;
export type MenuTriggerItemProps = Assign<HTMLProps<'div'>, MenuTriggerItemBaseProps>;

/** Render the Menu trigger item. */
export const MenuTriggerItem = (props: MenuTriggerItemProps) => {
  const getTriggerItemProps = useMenuTriggerItemContext();
  const mergedProps = mergeProps(() => getTriggerItemProps?.(), props);
  return (
    <MenuItemPropsProvider
      value={{
        /** Read the item value from the trigger item's props. */
        get value() {
          const value = mergedProps['data-value'];
          return typeof value === 'string' ? value : '';
        },
      }}
    >
      <primitive.div {...mergedProps} />
    </MenuItemPropsProvider>
  );
};
