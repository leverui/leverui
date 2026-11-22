import type { Assign } from '../../types';
import type { RootState as InputState } from '@zag-js/editable';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useEditableContext } from './use-editable-context';

export type EditableInputState = InputState;

export type EditableInputBaseProps = PolymorphicProps<'input', EditableInputState>;
export type EditableInputProps = Assign<HTMLProps<'input'>, EditableInputBaseProps>;

/** Render the Editable input. */
export const EditableInput = (props: EditableInputProps) => {
  const api = useEditableContext();
  const mergedProps = mergeProps(() => api().getInputProps(), props);
  const field = useFieldContext();

  return (
    <primitive.input
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={api().getRootState()}
    />
  );
};
