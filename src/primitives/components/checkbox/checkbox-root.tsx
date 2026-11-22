import type { Assign } from '../../types';
import type { RootState } from '@zag-js/checkbox';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseCheckboxProps, useCheckbox } from './use-checkbox';
import { CheckboxProvider } from './use-checkbox-context';

export type CheckboxRootState = RootState;

export type CheckboxRootBaseProps = UseCheckboxProps & PolymorphicProps<'label', CheckboxRootState>;
export type CheckboxRootProps = Assign<HTMLProps<'label'>, CheckboxRootBaseProps>;

/** Render the Checkbox root. */
export const CheckboxRoot = (props: CheckboxRootProps) => {
  const [useCheckboxProps, labelprops] = createSplitProps<UseCheckboxProps>()(props, [
    'checked',
    'defaultChecked',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'name',
    'onCheckedChange',
    'readOnly',
    'required',
    'value',
  ]);
  const checkbox = useCheckbox(useCheckboxProps);
  const mergedProps = mergeProps(() => checkbox().getRootProps(), labelprops);

  return (
    <CheckboxProvider value={checkbox}>
      <primitive.label {...mergedProps} state={checkbox().getRootState()} />
    </CheckboxProvider>
  );
};
