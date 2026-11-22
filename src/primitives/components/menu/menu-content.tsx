import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useMenuContext } from './use-menu-context';

export type MenuContentState = ContentState;

export type MenuContentBaseProps = PolymorphicProps<'div', MenuContentState>;
export type MenuContentProps = Assign<HTMLProps<'div'>, MenuContentBaseProps>;

/** Render the Menu content. */
export const MenuContent = (props: MenuContentProps) => {
  const context = useMenuContext();
  const presenceContext = usePresenceContext();
  const mergedProps = mergeProps(
    () => context().getContentProps(),
    () => presenceContext().presenceProps,
    props,
  );

  return (
    <Show when={!presenceContext().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => presenceContext().ref,
          () => props.ref,
        )}
        state={context().getContentState()}
      />
    </Show>
  );
};
