import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/collapsible';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCollapsibleContext } from './use-collapsible-context';

export type CollapsibleContentState = ContentState;

export type CollapsibleContentBaseProps = PolymorphicProps<'div', CollapsibleContentState>;
export type CollapsibleContentProps = Assign<HTMLProps<'div'>, CollapsibleContentBaseProps>;

/** Render the Collapsible content. */
export const CollapsibleContent = (props: CollapsibleContentProps) => {
  const api = useCollapsibleContext();
  const mergedProps = mergeProps(() => api().getContentProps(), props);

  return (
    <Show when={!api().unmounted}>
      <primitive.div {...mergedProps} state={api().getContentState()} />
    </Show>
  );
};
