import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type EmptyState, type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseCollapsibleProps, useCollapsible } from './use-collapsible';
import { CollapsibleProvider } from './use-collapsible-context';

export interface CollapsibleRootBaseProps<State = EmptyState>
  extends UseCollapsibleProps, PolymorphicProps<'div', State> {
  /**
   * @internal Set by a composing part such as `Accordion.Item`; the collapsible machine has no root state of its own.
   */
  state?: State;
}
export type CollapsibleRootProps<State = EmptyState> = Assign<
  HTMLProps<'div'>,
  CollapsibleRootBaseProps<State>
>;

/** Render the Collapsible root. */
export const CollapsibleRoot = <State = EmptyState,>(props: CollapsibleRootProps<State>) => {
  const [useCollapsibleProps, localProps] = createSplitProps<UseCollapsibleProps>()(props, [
    'collapsedHeight',
    'collapsedWidth',
    'defaultOpen',
    'disabled',
    'hiddenUntilFound',
    'id',
    'ids',
    'lazyMount',
    'onExitComplete',
    'onOpenChange',
    'open',
    'unmountOnExit',
  ]);

  const api = useCollapsible(useCollapsibleProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <CollapsibleProvider value={api}>
      <primitive.div {...mergedProps} />
    </CollapsibleProvider>
  );
};
