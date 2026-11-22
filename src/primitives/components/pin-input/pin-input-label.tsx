import type { Assign } from '../../types';
import type { RootState as LabelState } from '@zag-js/pin-input';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePinInputContext } from './use-pin-input-context';

export type PinInputLabelState = LabelState;

export type PinInputLabelBaseProps = PolymorphicProps<'label', PinInputLabelState>;
export type PinInputLabelProps = Assign<HTMLProps<'label'>, PinInputLabelBaseProps>;

/** Render the PinInput label. */
export const PinInputLabel = (props: PinInputLabelProps) => {
  const api = usePinInputContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} state={api().getRootState()} />;
};
