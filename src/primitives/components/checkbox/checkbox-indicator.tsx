import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCheckboxContext } from './use-checkbox-context';

interface IndicatorProps {
  indeterminate?: boolean;
}

export type CheckboxIndicatorBaseProps = IndicatorProps & PolymorphicProps<'span'>;
export type CheckboxIndicatorProps = Assign<HTMLProps<'span'>, CheckboxIndicatorBaseProps>;

/** Render the Checkbox indicator. */
export const CheckboxIndicator = (props: CheckboxIndicatorProps) => {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, ['indeterminate']);
  const checkbox = useCheckboxContext();
  const mergedProps = mergeProps(() => checkbox().getIndicatorProps(), localProps);

  return (
    <primitive.span
      {...mergedProps}
      hidden={!(indicatorProps.indeterminate ? checkbox().indeterminate : checkbox().checked)}
    />
  );
};
