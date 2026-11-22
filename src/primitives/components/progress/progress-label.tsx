import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressLabelBaseProps = PolymorphicProps<'span'>;
export type ProgressLabelProps = Assign<HTMLProps<'span'>, ProgressLabelBaseProps>;

/** Render the Progress label. */
export const ProgressLabel = (props: ProgressLabelProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.span {...mergedProps} />;
};
