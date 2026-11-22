import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import type { ContentState } from '@zag-js/marquee';
import { mergeProps } from '../../utils/merge-part-props';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMarqueeContext } from './use-marquee-context';

export type MarqueeContentState = ContentState;

export interface MarqueeContentBaseProps extends PolymorphicProps<'div', MarqueeContentState> {
  children?: JSX.Element;
}
export type MarqueeContentProps = Assign<HTMLProps<'div'>, MarqueeContentBaseProps>;

/** Render the Marquee content. */
export const MarqueeContent = (props: MarqueeContentProps) => {
  const [localProps, restProps] = splitProps(props, ['children']);
  const context = useMarqueeContext();

  return (
    <For each={Array.from({ length: context().contentCount })}>
      {(_, index) => {
        const mergedProps = mergeProps(
          () => context().getContentProps({ index: index() }),
          restProps,
        );
        return (
          <primitive.div {...mergedProps} state={context().getContentState({ index: index() })}>
            {localProps.children}
          </primitive.div>
        );
      }}
    </For>
  );
};
