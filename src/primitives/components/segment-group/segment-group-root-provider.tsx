import type { RootState } from '@zag-js/radio-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseSegmentGroupReturn } from './use-segment-group';
import { SegmentGroupProvider } from './use-segment-group-context';

interface RootProviderProps {
  value: UseSegmentGroupReturn;
}

export type SegmentGroupRootProviderState = RootState;

export type SegmentGroupRootProviderBaseProps = PolymorphicProps<
  'div',
  SegmentGroupRootProviderState
>;
export type SegmentGroupRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  SegmentGroupRootProviderBaseProps;

/** Provide the SegmentGroup root provider to its children. */
export const SegmentGroupRootProvider = (props: SegmentGroupRootProviderProps) => {
  const [{ value: segmentGroup }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => segmentGroup().getRootProps(), localProps);

  return (
    <SegmentGroupProvider value={segmentGroup}>
      <primitive.div {...mergedProps} state={segmentGroup().getRootState()} />
    </SegmentGroupProvider>
  );
};
