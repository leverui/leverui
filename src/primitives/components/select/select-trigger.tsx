import type { Assign } from '../../types';
import type { TriggerState } from '@zag-js/select';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useSelectContext } from './use-select-context';

export type SelectTriggerState = TriggerState;

export type SelectTriggerBaseProps = PolymorphicProps<'button', SelectTriggerState>;
export type SelectTriggerProps = Assign<HTMLProps<'button'>, SelectTriggerBaseProps>;

/** Render the Select trigger. */
export const SelectTrigger = (props: SelectTriggerProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getTriggerProps(), props);
  const field = useFieldContext();

  return (
    <primitive.button
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={select().getTriggerState()}
    />
  );
};
