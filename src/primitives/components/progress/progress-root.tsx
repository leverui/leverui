import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseProgressProps, useProgress } from './use-progress';
import { ProgressProvider } from './use-progress-context';

export type ProgressRootBaseProps = UseProgressProps & PolymorphicProps<'div'>;
export type ProgressRootProps = Assign<HTMLProps<'div'>, ProgressRootBaseProps>;

/** Render the Progress root. */
export const ProgressRoot = (props: ProgressRootProps) => {
  const [progressProps, localProps] = createSplitProps<UseProgressProps>()(props, [
    'defaultValue',
    'formatOptions',
    'id',
    'ids',
    'locale',
    'max',
    'min',
    'onValueChange',
    'orientation',
    'translations',
    'value',
  ]);

  const api = useProgress(progressProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <ProgressProvider value={api}>
      <primitive.div {...mergedProps} />
    </ProgressProvider>
  );
};
