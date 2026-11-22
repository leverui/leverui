import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { checkboxAnatomy } from './checkbox.anatomy';
import { type UseCheckboxGroupProps, useCheckboxGroup } from './use-checkbox-group';
import { CheckboxGroupContextProvider } from './use-checkbox-group-context';

export type CheckboxGroupBaseProps = UseCheckboxGroupProps & PolymorphicProps<'div'>;
export type CheckboxGroupProps = Assign<HTMLProps<'div'>, CheckboxGroupBaseProps>;

/** Render the Checkbox group. */
export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const [checkboxGroupProps, localProps] = createSplitProps<UseCheckboxGroupProps>()(props, [
    'defaultValue',
    'value',
    'onValueChange',
    'disabled',
    'invalid',
    'readOnly',
    'name',
    'maxSelectedValues',
  ]);
  const checkboxGroup = useCheckboxGroup(checkboxGroupProps);

  return (
    <CheckboxGroupContextProvider value={checkboxGroup}>
      <primitive.div role="group" {...localProps} {...checkboxAnatomy.build().group.attrs} />
    </CheckboxGroupContextProvider>
  );
};
