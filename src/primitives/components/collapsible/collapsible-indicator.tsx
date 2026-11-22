import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCollapsibleContext } from './use-collapsible-context';

export type CollapsibleIndicatorBaseProps = PolymorphicProps<'span'>;
export type CollapsibleIndicatorProps = Assign<HTMLProps<'span'>, CollapsibleIndicatorBaseProps>;

/** Render the Collapsible indicator. */
export const CollapsibleIndicator = (props: CollapsibleIndicatorProps) => {
  const collapsible = useCollapsibleContext();
  const mergedProps = mergeProps(() => collapsible().getIndicatorProps(), props);

  return <primitive.span {...mergedProps} />;
};
