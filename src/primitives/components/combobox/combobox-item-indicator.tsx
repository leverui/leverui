import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';
import { useComboboxItemPropsContext } from './use-combobox-item-props-context';

export type ComboboxItemIndicatorBaseProps = PolymorphicProps<'span'>;
export type ComboboxItemIndicatorProps = Assign<HTMLProps<'span'>, ComboboxItemIndicatorBaseProps>;

/** Render the Combobox item indicator. */
export const ComboboxItemIndicator = (props: ComboboxItemIndicatorProps) => {
  const combobox = useComboboxContext();
  const itemProps = useComboboxItemPropsContext();
  const mergedProps = mergeProps(() => combobox().getItemIndicatorProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
