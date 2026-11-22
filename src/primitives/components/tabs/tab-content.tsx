import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { ContentProps, ContentState } from '@zag-js/tabs';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { createSplitProps } from '../../utils/create-split-props';
import { useRenderStrategyContext } from '../../utils/render-strategy';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { PresenceProvider, usePresence } from '../presence/index';
import { useTabsContext } from './use-tabs-context';

export type TabContentState = ContentState;

export type TabContentBaseProps = ContentProps & PolymorphicProps<'div', TabContentState>;
export type TabContentProps = Assign<HTMLProps<'div'>, TabContentBaseProps>;

/** Render the Tabs tab content. */
export const TabContent = (props: TabContentProps) => {
  const [contentProps, localProps] = createSplitProps<ContentProps>()(props, ['value']);
  const api = useTabsContext();
  const renderStrategyProps = useRenderStrategyContext();
  const presenceApi = usePresence(
    mergeProps(renderStrategyProps, () => ({
      present: api().value === contentProps.value,
      immediate: true,
    })),
  );
  const mergedProps = mergeProps(
    () => api().getContentProps(contentProps),
    () => presenceApi().presenceProps,
    localProps,
  );

  return (
    <PresenceProvider value={presenceApi}>
      <Show when={!presenceApi().unmounted}>
        <primitive.div
          {...mergedProps}
          ref={composeRefGetters(
            () => presenceApi().ref,
            () => props.ref,
          )}
          state={api().getContentState(contentProps)}
        />
      </Show>
    </PresenceProvider>
  );
};
