import type { Assign } from '../../types';
import type { IndicatorState } from '@zag-js/clipboard';
import { mergeProps } from '../../utils/merge-part-props';
import { Show, children } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useClipboardContext } from './use-clipboard-context';

interface IndicatorProps {
  copied?: JSX.Element;
}

export type ClipboardIndicatorState = IndicatorState;

export type ClipboardIndicatorBaseProps = IndicatorProps &
  PolymorphicProps<'span', ClipboardIndicatorState>;
export type ClipboardIndicatorProps = Assign<HTMLProps<'span'>, ClipboardIndicatorBaseProps>;

/** Render the Clipboard indicator. */
export const ClipboardIndicator = (props: ClipboardIndicatorProps) => {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, ['copied']);
  const api = useClipboardContext();
  const mergedProps = mergeProps(api().getIndicatorProps({ copied: api().copied }), localProps);
  const getChildren = children(() => localProps.children);

  return (
    <primitive.span {...mergedProps} state={api().getIndicatorState({ copied: api().copied })}>
      <Show when={api().copied} fallback={getChildren()}>
        {indicatorProps.copied}
      </Show>
    </primitive.span>
  );
};
