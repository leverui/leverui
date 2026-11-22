import type { Assign } from '../../types';
import type { ViewProps, ViewState } from '@zag-js/progress';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useProgressContext } from './use-progress-context';

export type ProgressViewState = ViewState;

export type ProgressViewBaseProps = ViewProps & PolymorphicProps<'span', ProgressViewState>;
export type ProgressViewProps = Assign<HTMLProps<'span'>, ProgressViewBaseProps>;

/** Render the Progress view. */
export const ProgressView = (props: ProgressViewProps) => {
  const [state, localProps] = createSplitProps<ViewProps>()(props, ['state']);
  const api = useProgressContext();
  const mergedProps = mergeProps(() => api().getViewProps(state), localProps);

  return <primitive.span {...mergedProps} state={api().getViewState(state)} />;
};
