import type { Assign } from '../../types';
import type { BackdropState } from '@zag-js/dialog';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { useRenderStrategyContext } from '../../utils/render-strategy';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresence } from '../presence/index';
import { useDialogContext } from './use-dialog-context';

export type DialogBackdropState = BackdropState;

export type DialogBackdropBaseProps = PolymorphicProps<'div', DialogBackdropState>;
export type DialogBackdropProps = Assign<HTMLProps<'div'>, DialogBackdropBaseProps>;

/** Render the Dialog backdrop. */
export const DialogBackdrop = (props: DialogBackdropProps) => {
  const api = useDialogContext();
  const renderStrategyProps = useRenderStrategyContext();
  const presenceApi = usePresence(mergeProps(renderStrategyProps, () => ({ present: api().open })));
  const mergedProps = mergeProps(
    () => api().getBackdropProps(),
    () => presenceApi().presenceProps,
    props,
  );

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => presenceApi().ref,
          () => props.ref,
        )}
        state={api().getBackdropState()}
      />
    </Show>
  );
};
