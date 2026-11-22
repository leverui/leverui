import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldsetContext } from './use-fieldset-context';

export type FieldsetErrorTextBaseProps = PolymorphicProps<'span'>;
export type FieldsetErrorTextProps = Assign<HTMLProps<'span'>, FieldsetErrorTextBaseProps>;

/** Render the Fieldset error text. */
export const FieldsetErrorText = (props: FieldsetErrorTextProps) => {
  const fieldset = useFieldsetContext();
  const mergedProps = mergeProps(() => fieldset().getErrorTextProps(), props);

  return (
    <Show when={fieldset().invalid}>
      <primitive.span {...mergedProps} />
    </Show>
  );
};
