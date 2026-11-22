import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseProgressReturn } from './use-progress';
import { ProgressProvider } from './use-progress-context';

interface RootProviderProps {
  value: UseProgressReturn;
}

export type ProgressRootProviderBaseProps = PolymorphicProps<'div'>;
export type ProgressRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  ProgressRootProviderBaseProps;

/** Provide the Progress root provider to its children. */
export const ProgressRootProvider = (props: ProgressRootProviderProps) => {
  const [{ value: progress }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => progress().getRootProps(), localProps);

  return (
    <ProgressProvider value={progress}>
      <primitive.div {...mergedProps} />
    </ProgressProvider>
  );
};
