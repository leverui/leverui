import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseFieldsetReturn } from './use-fieldset';
import { FieldsetProvider } from './use-fieldset-context';

interface RootProviderProps {
  value: UseFieldsetReturn;
}

export type FieldsetRootProviderBaseProps = RootProviderProps & PolymorphicProps<'fieldset'>;
export type FieldsetRootProviderProps = Assign<
  HTMLProps<'fieldset'>,
  FieldsetRootProviderBaseProps
>;

/** Provide the Fieldset root provider to its children. */
export const FieldsetRootProvider = (props: FieldsetRootProviderProps) => {
  const [{ value: fieldset }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => fieldset().getRootProps(), localProps);

  return (
    <FieldsetProvider value={fieldset}>
      <primitive.fieldset {...mergedProps} />
    </FieldsetProvider>
  );
};
