import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export type FieldErrorTextBaseProps = PolymorphicProps<'span'>;
export type FieldErrorTextProps = Assign<HTMLProps<'span'>, FieldErrorTextBaseProps>;

/** Render the Field error text. */
export const FieldErrorText = (props: FieldErrorTextProps) => {
  const field = useFieldContext();
  const mergedProps = mergeProps(() => field().getErrorTextProps(), props);

  return (
    <Show when={field?.().invalid}>
      <primitive.span {...mergedProps} />
    </Show>
  );
};
