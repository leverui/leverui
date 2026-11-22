import type { Assign } from '../../types';
import type { RootState } from '@zag-js/radio-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseSegmentGroupProps, useSegmentGroup } from './use-segment-group';
import { SegmentGroupProvider } from './use-segment-group-context';

export type SegmentGroupRootState = RootState;

export type SegmentGroupRootBaseProps = UseSegmentGroupProps &
  PolymorphicProps<'div', SegmentGroupRootState>;
export type SegmentGroupRootProps = Assign<HTMLProps<'div'>, SegmentGroupRootBaseProps>;

/** Render the SegmentGroup root. */
export const SegmentGroupRoot = (props: SegmentGroupRootProps) => {
  const [useSegmentGroupProps, localProps] = createSplitProps<UseSegmentGroupProps>()(props, [
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'name',
    'onValueChange',
    'orientation',
    'readOnly',
    'required',
    'value',
  ]);
  const segmentGroup = useSegmentGroup(useSegmentGroupProps);
  const mergedProps = mergeProps(() => segmentGroup().getRootProps(), localProps);

  return (
    <SegmentGroupProvider value={segmentGroup}>
      <primitive.div {...mergedProps} state={segmentGroup().getRootState()} />
    </SegmentGroupProvider>
  );
};
