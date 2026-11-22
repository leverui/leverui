import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseFieldReturn } from './use-field';
import { FieldProvider } from './use-field-context';

interface RootProviderProps {
  value: UseFieldReturn;
}

export type FieldRootProviderBaseProps = PolymorphicProps<'div'>;
export type FieldRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  FieldRootProviderBaseProps;

/** Provide the Field root provider to its children. */
export const FieldRootProvider = (props: FieldRootProviderProps) => {
  const [{ value: field }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => field().getRootProps(), localProps);

  return (
    <FieldProvider value={field}>
      <primitive.div {...mergedProps} />
    </FieldProvider>
  );
};
