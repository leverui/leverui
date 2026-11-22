import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/floating-panel';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelContentState = ContentState;

export type FloatingPanelContentBaseProps = PolymorphicProps<'div', FloatingPanelContentState>;
export type FloatingPanelContentProps = Assign<HTMLProps<'div'>, FloatingPanelContentBaseProps>;

/** Render the FloatingPanel content. */
export const FloatingPanelContent = (props: FloatingPanelContentProps) => {
  const floatingPanel = useFloatingPanelContext();
  const presence = usePresenceContext();
  const mergedProps = mergeProps(
    () => floatingPanel().getContentProps(),
    () => presence().presenceProps,
    props,
  );

  return (
    <Show when={!presence().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => presence().ref,
          () => props.ref,
        )}
        state={floatingPanel().getContentState()}
      />
    </Show>
  );
};
