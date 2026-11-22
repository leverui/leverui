import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSplitterContext } from './use-splitter-context';
import { useSplitterResizeTriggerPropsContext } from './use-splitter-resize-trigger-props-context';

export type SplitterResizeTriggerIndicatorBaseProps = PolymorphicProps<'span'>;
export type SplitterResizeTriggerIndicatorProps = Assign<
  HTMLProps<'span'>,
  SplitterResizeTriggerIndicatorBaseProps
>;

/** Render the Splitter resize trigger indicator. */
export const SplitterResizeTriggerIndicator = (props: SplitterResizeTriggerIndicatorProps) => {
  const splitter = useSplitterContext();
  const triggerProps = useSplitterResizeTriggerPropsContext();
  const mergedProps = mergeProps(() => splitter().getResizeTriggerIndicator(triggerProps), props);

  return <primitive.span {...mergedProps} />;
};
