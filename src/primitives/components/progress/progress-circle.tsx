import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressCircleBaseProps = PolymorphicProps<'svg'>;
export type ProgressCircleProps = Assign<HTMLProps<'svg'>, ProgressCircleBaseProps>;

/** Render the Progress circle. */
export const ProgressCircle = (props: ProgressCircleProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getCircleProps(), props);

  return <primitive.svg {...mergedProps} />;
};
