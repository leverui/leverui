import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTabsContext } from './use-tabs-context';

export type TabIndicatorBaseProps = PolymorphicProps<'span'>;
export type TabIndicatorProps = Assign<HTMLProps<'span'>, TabIndicatorBaseProps>;

/** Render the Tabs tab indicator. */
export const TabIndicator = (props: TabIndicatorProps) => {
  const api = useTabsContext();
  const mergedProps = mergeProps(() => api().getIndicatorProps(), props);

  return <primitive.span {...mergedProps} />;
};
