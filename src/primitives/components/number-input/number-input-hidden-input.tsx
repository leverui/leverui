import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputHiddenInputBaseProps = PolymorphicProps<'input'>;
export type NumberInputHiddenInputProps = Assign<
  HTMLProps<'input'>,
  NumberInputHiddenInputBaseProps
>;

/** The hidden input that submits the raw number with a form. Render it when `name` is set. */
export const NumberInputHiddenInput = (props: NumberInputHiddenInputProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getHiddenInputProps(), props);

  return <primitive.input {...mergedProps} />;
};
