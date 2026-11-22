import { mergeProps } from '../../utils/merge-part-props';
import type { ResizeTriggerProps, ResizeTriggerState } from '@zag-js/splitter';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSplitterContext } from './use-splitter-context';
import { SplitterResizeTriggerPropsProvider } from './use-splitter-resize-trigger-props-context';

export type SplitterResizeTriggerState = ResizeTriggerState;

export type SplitterResizeTriggerBaseProps = ResizeTriggerProps &
  PolymorphicProps<'button', SplitterResizeTriggerState>;
export type SplitterResizeTriggerProps = Assign<
  HTMLProps<'button'>,
  SplitterResizeTriggerBaseProps
>;

/** Render the Splitter resize trigger. */
export const SplitterResizeTrigger = (props: SplitterResizeTriggerProps) => {
  const [resizeTriggerProps, restProps] = createSplitProps<ResizeTriggerProps>()(props, [
    'disabled',
    'id',
  ]);
  const api = useSplitterContext();
  const mergedProps = mergeProps(() => api().getResizeTriggerProps(resizeTriggerProps), restProps);

  return (
    <SplitterResizeTriggerPropsProvider value={resizeTriggerProps}>
      <primitive.button {...mergedProps} state={api().getResizeTriggerState(resizeTriggerProps)} />
    </SplitterResizeTriggerPropsProvider>
  );
};
