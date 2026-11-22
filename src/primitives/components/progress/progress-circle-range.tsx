import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressCircleRangeBaseProps = PolymorphicProps<'circle'>;
export type ProgressCircleRangeProps = Assign<HTMLProps<'circle'>, ProgressCircleRangeBaseProps>;

/** Render the Progress circle range. */
export const ProgressCircleRange = (props: ProgressCircleRangeProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getCircleRangeProps(), props);

  return <primitive.circle {...mergedProps} />;
};
