import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseCollapsibleReturn } from './use-collapsible';
import { CollapsibleProvider } from './use-collapsible-context';

interface RootProviderProps {
  value: UseCollapsibleReturn;
}

export type CollapsibleRootProviderBaseProps = PolymorphicProps<'div'>;
export type CollapsibleRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  CollapsibleRootProviderBaseProps;

/** Provide the Collapsible root provider to its children. */
export const CollapsibleRootProvider = (props: CollapsibleRootProviderProps) => {
  const [{ value: collapsible }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => collapsible().getRootProps(), localProps);

  return (
    <CollapsibleProvider value={collapsible}>
      <primitive.div {...mergedProps} />
    </CollapsibleProvider>
  );
};
