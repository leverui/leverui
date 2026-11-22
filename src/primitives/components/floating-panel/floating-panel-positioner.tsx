import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelPositionerBaseProps = PolymorphicProps<'div'>;
export type FloatingPanelPositionerProps = Assign<
  HTMLProps<'div'>,
  FloatingPanelPositionerBaseProps
>;

/** Render the FloatingPanel positioner. */
export const FloatingPanelPositioner = (props: FloatingPanelPositionerProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getPositionerProps(), props);
  const presence = usePresenceContext();

  return (
    <Show when={!presence().unmounted}>
      <primitive.div {...mergedProps} />
    </Show>
  );
};
