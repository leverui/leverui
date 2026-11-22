import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseSplitterReturn } from './use-splitter';
import { SplitterProvider } from './use-splitter-context';

interface RootProviderProps {
  value: UseSplitterReturn;
}

export type SplitterRootProviderBaseProps = PolymorphicProps<'div'>;
export type SplitterRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  SplitterRootProviderBaseProps;

/** Provide the Splitter root provider to its children. */
export const SplitterRootProvider = (props: SplitterRootProviderProps) => {
  const [{ value: splitter }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => splitter().getRootProps(), localProps);

  return (
    <SplitterProvider value={splitter}>
      <primitive.div {...mergedProps} />
    </SplitterProvider>
  );
};
