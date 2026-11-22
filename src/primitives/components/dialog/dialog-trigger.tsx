import type { TriggerProps, TriggerState } from '@zag-js/dialog';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useDialogContext } from './use-dialog-context';

export type DialogTriggerState = TriggerState;

export type DialogTriggerBaseProps = TriggerProps & PolymorphicProps<'button', DialogTriggerState>;
export type DialogTriggerProps = Assign<HTMLProps<'button'>, DialogTriggerBaseProps>;

/** Render the Dialog trigger. */
export const DialogTrigger = (props: DialogTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['value']);
  const api = useDialogContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(
    () => api().getTriggerProps(triggerProps),
    () => ({ 'aria-controls': presenceApi().unmounted && null }),
    localProps,
  );

  return <primitive.button {...mergedProps} state={api().getTriggerState(triggerProps)} />;
};
