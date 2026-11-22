import type { RootState } from '@zag-js/pin-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UsePinInputReturn } from './use-pin-input';
import { PinInputProvider } from './use-pin-input-context';

interface RootProviderProps {
  value: UsePinInputReturn;
}

export type PinInputRootProviderState = RootState;

export type PinInputRootProviderBaseProps = PolymorphicProps<'div', PinInputRootProviderState>;
export type PinInputRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  PinInputRootProviderBaseProps;

/** Provide the PinInput root provider to its children. */
export const PinInputRootProvider = (props: PinInputRootProviderProps) => {
  const [{ value: pinInput }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => pinInput().getRootProps(), localProps);

  return (
    <PinInputProvider value={pinInput}>
      <primitive.div {...mergedProps} state={pinInput().getRootState()} />
    </PinInputProvider>
  );
};
