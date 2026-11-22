import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseEditableProps, useEditable } from './use-editable';
import { EditableProvider } from './use-editable-context';

export type EditableRootBaseProps = UseEditableProps & PolymorphicProps<'div'>;
export type EditableRootProps = Assign<HTMLProps<'div'>, EditableRootBaseProps>;

/** Render the Editable root. */
export const EditableRoot = (props: EditableRootProps) => {
  const [useEditableProps, localProps] = createSplitProps<UseEditableProps>()(props, [
    'activationMode',
    'autoResize',
    'defaultEdit',
    'defaultValue',
    'disabled',
    'edit',
    'finalFocusEl',
    'form',
    'id',
    'ids',
    'invalid',
    'maxLength',
    'name',
    'onEditChange',
    'onFocusOutside',
    'onInteractOutside',
    'onPointerDownOutside',
    'onValueChange',
    'onValueCommit',
    'onValueRevert',
    'placeholder',
    'readOnly',
    'required',
    'selectOnFocus',
    'submitMode',
    'translations',
    'value',
  ]);

  const api = useEditable(useEditableProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <EditableProvider value={api}>
      <primitive.div {...mergedProps} />
    </EditableProvider>
  );
};
