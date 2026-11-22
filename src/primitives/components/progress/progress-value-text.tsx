import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressValueTextBaseProps = PolymorphicProps<'span'>;
export type ProgressValueTextProps = Assign<HTMLProps<'span'>, ProgressValueTextBaseProps>;

/** Render the Progress value text. */
export const ProgressValueText = (props: ProgressValueTextProps) => {
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getValueTextProps(), props);

  return (
    <primitive.span {...mergedProps}>{props.children || api().percentAsString}</primitive.span>
  );
};
