import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { useMenuContext } from './menu-machine';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { createMenuEscapeFocusRef } from './menu-escape-focus';
import { renderMenuPart } from './menu-part';
import type {
  MenuArrowProps,
  MenuArrowTipProps,
  MenuContentProps,
  MenuContextTriggerProps,
  MenuIndicatorProps,
  MenuPositionerProps,
  MenuSeparatorProps,
  MenuTriggerProps,
} from './menu-part-props';

/** Open the nearest menu through pointer, keyboard, or focus activation. */
export function MenuTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: MenuTriggerProps<As>,
): JSX.Element {
  return renderMenuPart('trigger', props);
}

/** Open the nearest menu from a context-menu gesture. */
export function MenuContextTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: MenuContextTriggerProps<As>,
): JSX.Element {
  return renderMenuPart('contextTrigger', props);
}

/** Position the menu surface using the primitive's floating placement. */
export function MenuPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: MenuPositionerProps<As>,
): JSX.Element {
  return renderMenuPart('positioner', props);
}

/** Render the presence-controlled menu surface. */
export function MenuContent<As extends PrimitiveNativeTag = 'div'>(
  props: MenuContentProps<As>,
): JSX.Element {
  const menu = useMenuContext();
  const ref = createMenuEscapeFocusRef(
    /** Read the current caller ref when the primitive supplies the native node. */
    () => props.ref,
    /** Use Zag's trigger relationship before caller ARIA overrides are merged. */
    () => menu().getContentProps()['aria-labelledby'] || undefined,
  );
  return renderMenuPart('content', mergeProps(props, { ref }));
}

/** Render the positioned arrow with a tip by default. */
export function MenuArrow<As extends PrimitiveNativeTag = 'div'>(
  props: MenuArrowProps<As>,
): JSX.Element {
  return renderMenuPart(
    'arrow',
    props,
    /** Create the styled tip only when Arrow children are omitted. */
    () => <MenuArrowTip />,
  );
}

/** Render the styled tip of the menu arrow. */
export function MenuArrowTip<As extends PrimitiveNativeTag = 'div'>(
  props: MenuArrowTipProps<As>,
): JSX.Element {
  return renderMenuPart('arrowTip', props);
}

/** Show menu open state near a trigger. */
export function MenuIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: MenuIndicatorProps<As>,
): JSX.Element {
  return renderMenuPart('indicator', props);
}

/** Separate related menu items with the primitive's native separator semantics. */
export function MenuSeparator<As extends PrimitiveNativeTag = 'hr'>(
  props: MenuSeparatorProps<As>,
): JSX.Element {
  return renderMenuPart('separator', props);
}
