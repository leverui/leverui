import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';
import { useListboxItemPropsContext } from './use-listbox-item-props-context';

export type ListboxItemIndicatorBaseProps = PolymorphicProps<'span'>;
export type ListboxItemIndicatorProps = Assign<HTMLProps<'span'>, ListboxItemIndicatorBaseProps>;

/** Render the Listbox item indicator. */
export const ListboxItemIndicator = (props: ListboxItemIndicatorProps) => {
  const listbox = useListboxContext();
  const itemProps = useListboxItemPropsContext();
  const mergedProps = mergeProps(() => listbox().getItemIndicatorProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
