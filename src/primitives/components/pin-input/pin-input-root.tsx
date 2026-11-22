import type { Assign } from '../../types';
import type { RootState } from '@zag-js/pin-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UsePinInputProps, usePinInput } from './use-pin-input';
import { PinInputProvider } from './use-pin-input-context';

export type PinInputRootState = RootState;

export type PinInputRootBaseProps = UsePinInputProps & PolymorphicProps<'div', PinInputRootState>;
export type PinInputRootProps = Assign<HTMLProps<'div'>, PinInputRootBaseProps>;

/** Render the PinInput root. */
export const PinInputRoot = (props: PinInputRootProps) => {
  const [usePinInputProps, localProps] = createSplitProps<UsePinInputProps>()(props, [
    'autoFocus',
    'autoSubmit',
    'count',
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'mask',
    'name',
    'onValueChange',
    'onValueComplete',
    'onValueInvalid',
    'otp',
    'pattern',
    'placeholder',
    'readOnly',
    'required',
    'normalizeValue',
    'translations',
    'type',
    'value',
  ]);
  const pinInput = usePinInput(usePinInputProps);
  const mergedProps = mergeProps(() => pinInput().getRootProps(), localProps);

  return (
    <PinInputProvider value={pinInput}>
      <primitive.div {...mergedProps} state={pinInput().getRootState()} />
    </PinInputProvider>
  );
};
