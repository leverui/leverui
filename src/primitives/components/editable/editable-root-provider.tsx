import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseEditableReturn } from './use-editable';
import { EditableProvider } from './use-editable-context';

interface RootProviderProps {
  value: UseEditableReturn;
}

export type EditableRootProviderBaseProps = PolymorphicProps<'div'>;
export type EditableRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  EditableRootProviderBaseProps;

/** Provide the Editable root provider to its children. */
export const EditableRootProvider = (props: EditableRootProviderProps) => {
  const [{ value: editable }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => editable().getRootProps(), localProps);

  return (
    <EditableProvider value={editable}>
      <primitive.div {...mergedProps} />
    </EditableProvider>
  );
};
