import type { RootState } from '@zag-js/number-input';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseNumberInputProps, useNumberInput } from './use-number-input';
import { NumberInputProvider } from './use-number-input-context';

export type NumberInputRootState = RootState;

export type NumberInputRootBaseProps = UseNumberInputProps &
  PolymorphicProps<'div', NumberInputRootState>;
export type NumberInputRootProps = Assign<HTMLProps<'div'>, NumberInputRootBaseProps>;

/** Render the NumberInput root. */
export const NumberInputRoot = (props: NumberInputRootProps) => {
  const [useNumberInputProps, localProps] = createSplitProps<UseNumberInputProps>()(props, [
    'allowMouseWheel',
    'defaultValue',
    'disabled',
    'allowOutOfRange',
    'focusInputOnChange',
    'form',
    'formatOptions',
    'id',
    'ids',
    'inputMode',
    'invalid',
    'largeStep',
    'locale',
    'max',
    'min',
    'name',
    'onFocusChange',
    'onValueChange',
    'onValueCommit',
    'onValueInvalid',
    'pattern',
    'readOnly',
    'required',
    'scrubberDirection',
    'scrubberPixelSensitivity',
    'scrubberTeleportDistance',
    'smallStep',
    'snapOnStep',
    'spinOnPress',
    'step',
    'translations',
    'value',
  ]);
  const api = useNumberInput(useNumberInputProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <NumberInputProvider value={api}>
      <primitive.div {...mergedProps} state={api().getRootState()} />
    </NumberInputProvider>
  );
};
