import type { RootState } from '@zag-js/number-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseNumberInputReturn } from './use-number-input';
import { NumberInputProvider } from './use-number-input-context';

interface RootProviderProps {
  value: UseNumberInputReturn;
}

export type NumberInputRootProviderState = RootState;

export type NumberInputRootProviderBaseProps = PolymorphicProps<
  'div',
  NumberInputRootProviderState
>;
export type NumberInputRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  NumberInputRootProviderBaseProps;

/** Provide the NumberInput root provider to its children. */
export const NumberInputRootProvider = (props: NumberInputRootProviderProps) => {
  const [{ value: numberInput }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => numberInput().getRootProps(), localProps);

  return (
    <NumberInputProvider value={numberInput}>
      <primitive.div {...mergedProps} state={numberInput().getRootState()} />
    </NumberInputProvider>
  );
};
