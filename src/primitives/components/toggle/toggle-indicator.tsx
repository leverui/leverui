import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { HTMLProps, PolymorphicProps } from '../factory';
import { primitive } from '../factory';
import { useToggleContext } from './use-toggle-context';

export interface ToggleIndicatorBaseProps extends PolymorphicProps<'span'> {
  fallback?: JSX.Element;
}

export type ToggleIndicatorProps = Assign<HTMLProps<'span'>, ToggleIndicatorBaseProps>;

/** Render the Toggle indicator. */
export const ToggleIndicator = (props: ToggleIndicatorProps) => {
  const [baseProps, restProps] = splitProps(props, ['children', 'fallback']);
  const toggle = useToggleContext();
  const mergedProps = mergeProps(() => toggle().getIndicatorProps(), restProps);
  return (
    <primitive.span {...mergedProps}>
      <Show when={toggle().pressed} fallback={baseProps.fallback}>
        {baseProps.children}
      </Show>
    </primitive.span>
  );
};
