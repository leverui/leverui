import type { RootState } from '@zag-js/checkbox';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseCheckboxReturn } from './use-checkbox';
import { CheckboxProvider } from './use-checkbox-context';

interface RootProviderProps {
  value: UseCheckboxReturn;
}

export type CheckboxRootProviderState = RootState;

export type CheckboxRootProviderBaseProps = PolymorphicProps<'label', CheckboxRootProviderState>;
export type CheckboxRootProviderProps = HTMLProps<'label'> &
  RootProviderProps &
  CheckboxRootProviderBaseProps;

/** Provide the Checkbox root provider to its children. */
export const CheckboxRootProvider = (props: CheckboxRootProviderProps) => {
  const [{ value: checkbox }, labelprops] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => checkbox().getRootProps(), labelprops);

  return (
    <CheckboxProvider value={checkbox}>
      <primitive.label {...mergedProps} state={checkbox().getRootState()} />
    </CheckboxProvider>
  );
};
