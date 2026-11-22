import type { RootState } from '@zag-js/radio-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseRadioGroupReturn } from './use-radio-group';
import { RadioGroupProvider } from './use-radio-group-context';

interface RootProviderProps {
  value: UseRadioGroupReturn;
}

export type RadioGroupRootProviderState = RootState;

export type RadioGroupRootProviderBaseProps = PolymorphicProps<'div', RadioGroupRootProviderState>;
export type RadioGroupRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  RadioGroupRootProviderBaseProps;

/** Provide the RadioGroup root provider to its children. */
export const RadioGroupRootProvider = (props: RadioGroupRootProviderProps) => {
  const [{ value: radioGroup }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => radioGroup().getRootProps(), localProps);

  return (
    <RadioGroupProvider value={radioGroup}>
      <primitive.div {...mergedProps} state={radioGroup().getRootState()} />
    </RadioGroupProvider>
  );
};
