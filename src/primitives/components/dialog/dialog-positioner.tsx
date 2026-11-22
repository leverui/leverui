import type { Assign } from '../../types';
import type { PositionerState } from '@zag-js/dialog';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useDialogContext } from './use-dialog-context';

export type DialogPositionerState = PositionerState;

export type DialogPositionerBaseProps = PolymorphicProps<'div', DialogPositionerState>;
export type DialogPositionerProps = Assign<HTMLProps<'div'>, DialogPositionerBaseProps>;

/** Render the Dialog positioner. */
export const DialogPositioner = (props: DialogPositionerProps) => {
  const api = useDialogContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} state={api().getPositionerState()} />
    </Show>
  );
};
