import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputValueTextBaseProps = PolymorphicProps<'span'>;
export type NumberInputValueTextProps = Assign<HTMLProps<'span'>, NumberInputValueTextBaseProps>;

/** Render the NumberInput value text. */
export const NumberInputValueText = (props: NumberInputValueTextProps) => {
  const numberInput = useNumberInputContext();
  const mergedProps = mergeProps(() => numberInput().getValueTextProps(), props);

  return <primitive.span {...mergedProps}>{props.children || numberInput().value}</primitive.span>;
};
