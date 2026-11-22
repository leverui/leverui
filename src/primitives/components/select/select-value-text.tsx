import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export interface SelectValueTextBaseProps extends PolymorphicProps<'span'> {
  /**
   * Text to display when no value is selected.
   */
  placeholder?: string;
}
export type SelectValueTextProps = Assign<HTMLProps<'span'>, SelectValueTextBaseProps>;

/** Render the Select value text. */
export const SelectValueText = (props: SelectValueTextProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getValueTextProps(), props);

  return (
    <primitive.span {...mergedProps}>
      {props.children || select().valueAsString || props.placeholder}
    </primitive.span>
  );
};
