import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import {
  type RenderStrategyProps,
  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '../../utils/render-strategy';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseTabsReturn } from './use-tabs';
import { TabsProvider } from './use-tabs-context';

interface RootProviderProps {
  value: UseTabsReturn;
}

export type TabsRootProviderBaseProps = RootProviderProps &
  RenderStrategyProps &
  PolymorphicProps<'div'>;
export type TabsRootProviderProps = Assign<HTMLProps<'div'>, TabsRootProviderBaseProps>;

/** Provide the Tabs root provider to its children. */
export const TabsRootProvider = (props: TabsRootProviderProps) => {
  const [renderStrategyProps, tabsProps] = splitRenderStrategyProps(props);
  const [{ value: tabs }, localprops] = createSplitProps<RootProviderProps>()(tabsProps, ['value']);
  const mergedProps = mergeProps(() => tabs().getRootProps(), localprops);

  return (
    <TabsProvider value={tabs}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <primitive.div {...mergedProps} />
      </RenderStrategyProvider>
    </TabsProvider>
  );
};
