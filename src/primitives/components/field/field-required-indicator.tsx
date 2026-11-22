import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export interface FieldRequiredIndicatorBaseProps extends PolymorphicProps<'span'> {
  fallback?: JSX.Element;
}
export type FieldRequiredIndicatorProps = Assign<
  HTMLProps<'span'>,
  FieldRequiredIndicatorBaseProps
>;

/** Render the Field required indicator. */
export const FieldRequiredIndicator = (props: FieldRequiredIndicatorProps) => {
  const field = useFieldContext();
  const mergedProps = mergeProps(() => field().getRequiredIndicatorProps(), props);

  return (
    <Show when={field().required} fallback={props.fallback}>
      <primitive.span {...mergedProps}>{props.children ?? '*'}</primitive.span>
    </Show>
  );
};
