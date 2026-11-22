import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputScrubberBaseProps = PolymorphicProps<'span'>;
export type NumberInputScrubberProps = Assign<HTMLProps<'span'>, NumberInputScrubberBaseProps>;

/** Render the NumberInput scrubber. */
export const NumberInputScrubber = (props: NumberInputScrubberProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getScrubberProps(), props);

  return <primitive.span {...mergedProps} />;
};
