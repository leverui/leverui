import type { Assign } from '../../types';
import type { RootState } from '@zag-js/radio-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseRadioGroupProps, useRadioGroup } from './use-radio-group';
import { RadioGroupProvider } from './use-radio-group-context';

export type RadioGroupRootState = RootState;

export type RadioGroupRootBaseProps = UseRadioGroupProps &
  PolymorphicProps<'div', RadioGroupRootState>;
export type RadioGroupRootProps = Assign<HTMLProps<'div'>, RadioGroupRootBaseProps>;

/** Render the RadioGroup root. */
export const RadioGroupRoot = (props: RadioGroupRootProps) => {
  const [useRadioGroupProps, localProps] = createSplitProps<UseRadioGroupProps>()(props, [
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'name',
    'onValueChange',
    'orientation',
    'readOnly',
    'required',
    'value',
  ]);

  const radioGroup = useRadioGroup(useRadioGroupProps);
  const mergedProps = mergeProps(() => radioGroup().getRootProps(), localProps);

  return (
    <RadioGroupProvider value={radioGroup}>
      <primitive.div {...mergedProps} state={radioGroup().getRootState()} />
    </RadioGroupProvider>
  );
};
