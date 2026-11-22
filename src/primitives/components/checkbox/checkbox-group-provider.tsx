import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { checkboxAnatomy } from './checkbox.anatomy';
import {
  CheckboxGroupContextProvider,
  type UseCheckboxGroupContext,
} from './use-checkbox-group-context';

interface ProviderProps {
  value: UseCheckboxGroupContext;
}

export type CheckboxGroupProviderBaseProps = ProviderProps & PolymorphicProps<'div'>;
export type CheckboxGroupProviderProps = Assign<HTMLProps<'div'>, CheckboxGroupProviderBaseProps>;

/** Provide the Checkbox group provider to its children. */
export const CheckboxGroupProvider = (props: CheckboxGroupProviderProps) => {
  const [localProps, restProps] = createSplitProps<ProviderProps>()(props, ['value']);

  return (
    <CheckboxGroupContextProvider value={localProps.value}>
      <primitive.div role="group" {...restProps} {...checkboxAnatomy.build().group.attrs} />
    </CheckboxGroupContextProvider>
  );
};
