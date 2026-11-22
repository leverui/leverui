import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressCircleTrackBaseProps = PolymorphicProps<'circle'>;
export type ProgressCircleTrackProps = Assign<HTMLProps<'circle'>, ProgressCircleTrackBaseProps>;

/** Render the Progress circle track. */
export const ProgressCircleTrack = (props: ProgressCircleTrackProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getCircleTrackProps(), props);

  return <primitive.circle {...mergedProps} />;
};
