import type { TriggerProps, TriggerState } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useMenuContext } from './use-menu-context';

export type MenuTriggerState = TriggerState;

export type MenuTriggerBaseProps = TriggerProps & PolymorphicProps<'button', MenuTriggerState>;
export type MenuTriggerProps = Assign<HTMLProps<'button'>, MenuTriggerBaseProps>;

/** Render the Menu trigger. */
export const MenuTrigger = (props: MenuTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['value']);
  const api = useMenuContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(
    () => api().getTriggerProps(triggerProps),
    () => ({ 'aria-controls': presenceApi().unmounted && null }),
    localProps,
  );
  return <primitive.button {...mergedProps} state={api().getTriggerState(triggerProps)} />;
};
