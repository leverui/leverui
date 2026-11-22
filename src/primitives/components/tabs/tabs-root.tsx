import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import {
  type RenderStrategyProps,
  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '../../utils/render-strategy';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseTabsProps, useTabs } from './use-tabs';
import { TabsProvider } from './use-tabs-context';

export type TabsRootBaseProps = UseTabsProps & RenderStrategyProps & PolymorphicProps<'div'>;
export type TabsRootProps = Assign<HTMLProps<'div'>, TabsRootBaseProps>;

/** Render the Tabs root. */
export const TabsRoot = (props: TabsRootProps) => {
  const [renderStrategyProps, tabsProps] = splitRenderStrategyProps(props);
  const [useTabsProps, restProps] = createSplitProps<UseTabsProps>()(tabsProps, [
    'activationMode',
    'defaultValue',
    'deselectable',
    'id',
    'ids',
    'loopFocus',
    'navigate',
    'onFocusChange',
    'onValueChange',
    'orientation',
    'translations',
    'value',
    'virtualFocus',
  ]);

  const api = useTabs(useTabsProps);
  const mergedProps = mergeProps(() => api().getRootProps(), restProps);

  return (
    <TabsProvider value={api}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <primitive.div {...mergedProps} />
      </RenderStrategyProvider>
    </TabsProvider>
  );
};
