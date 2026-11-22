import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressRangeBaseProps = PolymorphicProps<'div'>;
export type ProgressRangeProps = Assign<HTMLProps<'div'>, ProgressRangeBaseProps>;

/** Render the Progress range. */
export const ProgressRange = (props: ProgressRangeProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getRangeProps(), props);

  return <primitive.div {...mergedProps} />;
};
