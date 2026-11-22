import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressTrackBaseProps = PolymorphicProps<'div'>;
export type ProgressTrackProps = Assign<HTMLProps<'div'>, ProgressTrackBaseProps>;

/** Render the Progress track. */
export const ProgressTrack = (props: ProgressTrackProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getTrackProps(), props);

  return <primitive.div {...mergedProps} />;
};
