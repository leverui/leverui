import type { Assign } from '../../types';
import type { PositionerState } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useMenuContext } from './use-menu-context';

export type MenuPositionerState = PositionerState;

export type MenuPositionerBaseProps = PolymorphicProps<'div', MenuPositionerState>;
export type MenuPositionerProps = Assign<HTMLProps<'div'>, MenuPositionerBaseProps>;

/** Render the Menu positioner. */
export const MenuPositioner = (props: MenuPositionerProps) => {
  const context = useMenuContext();
  const presence = usePresenceContext();
  const mergedProps = mergeProps(() => context().getPositionerProps(), props);

  return (
    <Show when={!presence().unmounted}>
      <primitive.div {...mergedProps} state={context().getPositionerState()} />
    </Show>
  );
};
