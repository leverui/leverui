import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTabsContext } from './use-tabs-context';

export type TabListBaseProps = PolymorphicProps<'div'>;
export type TabListProps = Assign<HTMLProps<'div'>, TabListBaseProps>;

/** Render the Tabs tab list. */
export const TabList = (props: TabListProps) => {
  const api = useTabsContext();
  const mergedProps = mergeProps(() => api().getListProps(), props);

  return <primitive.div {...mergedProps} />;
};
