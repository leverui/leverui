import type { Assign } from '../../types';
import type { TriggerProps, TriggerState } from '@zag-js/combobox';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxTriggerState = TriggerState;

export type ComboboxTriggerBaseProps = TriggerProps &
  PolymorphicProps<'button', ComboboxTriggerState>;
export type ComboboxTriggerProps = Assign<HTMLProps<'button'>, ComboboxTriggerBaseProps>;

/** Render the Combobox trigger. */
export const ComboboxTrigger = (props: ComboboxTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['focusable']);
  const combobox = useComboboxContext();
  const mergedProps = mergeProps(() => combobox().getTriggerProps(triggerProps), localProps);

  return <primitive.button {...mergedProps} state={combobox().getTriggerState(triggerProps)} />;
};
