import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { useMenuContext } from './menu-machine';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { MenuCheckIcon } from './menu-icon';
import { renderMenuPart } from './menu-part';
import type {
  MenuCheckboxItemProps,
  MenuItemCommandProps,
  MenuItemGroupLabelProps,
  MenuItemGroupProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuItemTextProps,
  MenuRadioItemGroupProps,
  MenuRadioItemProps,
  MenuTriggerItemProps,
} from './menu-part-props';

/** Render an actionable menu item with the primitive selection behavior. */
export function MenuItem<As extends PrimitiveNativeTag = 'div'>(
  props: MenuItemProps<As>,
): JSX.Element {
  return renderMenuPart('item', props);
}

/**
 * Open a nested menu from its parent's menu item.
 *
 * The primitive layer swaps this item's part attribute from `data-menu-trigger` to
 * `data-menu-trigger-item` once the child menu links to its parent, and Solid's
 * spread drops the old key without adding the new one, so the child cannot
 * find its anchor. Lever always passes the key, reading its value from the
 * child machine, so the nested menu positions against this item.
 */
export function MenuTriggerItem<As extends PrimitiveNativeTag = 'div'>(
  props: MenuTriggerItemProps<As>,
): JSX.Element {
  const menu = useMenuContext();
  const anchored = mergeProps(props, {
    /** Mark this item as the child menu's trigger item. */
    get 'data-menu-trigger-item'() {
      const value: unknown = Reflect.get(menu().getTriggerProps(), 'data-menu-trigger-item');
      return typeof value === 'string' ? value : undefined;
    },
  });
  return renderMenuPart('triggerItem', anchored);
}

/** Render the flexible text of an actionable menu item. */
export function MenuItemText<As extends PrimitiveNativeTag = 'div'>(
  props: MenuItemTextProps<As>,
): JSX.Element {
  return renderMenuPart('itemText', props);
}

/** Render an item's keyboard command in a native kbd element. */
export function MenuItemCommand<As extends PrimitiveNativeTag = 'kbd'>(
  props: MenuItemCommandProps<As>,
): JSX.Element {
  return renderMenuPart('itemCommand', props);
}

/** Show selected state with a default check mark when no child is supplied. */
export function MenuItemIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: MenuItemIndicatorProps<As>,
): JSX.Element {
  return renderMenuPart(
    'itemIndicator',
    props,
    /** Create the selection mark only when children are omitted. */
    () => <MenuCheckIcon />,
  );
}

/** Group related items with the primitive's menu group semantics. */
export function MenuItemGroup<As extends PrimitiveNativeTag = 'div'>(
  props: MenuItemGroupProps<As>,
): JSX.Element {
  return renderMenuPart('itemGroup', props);
}

/** Label the nearest menu item group. */
export function MenuItemGroupLabel<As extends PrimitiveNativeTag = 'div'>(
  props: MenuItemGroupLabelProps<As>,
): JSX.Element {
  return renderMenuPart('itemGroupLabel', props);
}

/** Render a checked menu option with the primitive selection state. */
export function MenuCheckboxItem<As extends PrimitiveNativeTag = 'div'>(
  props: MenuCheckboxItemProps<As>,
): JSX.Element {
  return renderMenuPart('checkboxItem', props);
}

/** Supply the selected value to radio menu options. */
export function MenuRadioItemGroup<As extends PrimitiveNativeTag = 'div'>(
  props: MenuRadioItemGroupProps<As>,
): JSX.Element {
  return renderMenuPart('radioItemGroup', props);
}

/** Render one radio option within a menu group. */
export function MenuRadioItem<As extends PrimitiveNativeTag = 'div'>(
  props: MenuRadioItemProps<As>,
): JSX.Element {
  return renderMenuPart('radioItem', props);
}
