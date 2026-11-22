import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseStepsReturn } from './use-steps';
import { StepsProvider } from './use-steps-context';

interface RootProviderProps {
  value: UseStepsReturn;
}

export type StepsRootProviderBaseProps = RootProviderProps & PolymorphicProps<'div'>;
export type StepsRootProviderProps = Assign<HTMLProps<'div'>, StepsRootProviderBaseProps>;

/** Provide the Steps root provider to its children. */
export const StepsRootProvider = (props: StepsRootProviderProps) => {
  const [{ value: steps }, rootProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => steps().getRootProps(), rootProps);

  return (
    <StepsProvider value={steps}>
      <primitive.div {...mergedProps} />
    </StepsProvider>
  );
};
