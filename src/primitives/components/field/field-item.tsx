import { type JSX } from '@solidjs/web';
import { parts } from './field.anatomy';
import { FieldProvider, useFieldContext, type UseFieldContext } from './use-field-context';

export interface FieldItemBaseProps {
  value: string;
}

export interface FieldItemProps extends FieldItemBaseProps {
  children?: JSX.Element;
}

/** Render the Field item. */
export const FieldItem = (props: FieldItemProps) => {
  const parentField = useFieldContext();

  /** Item field. */
  const itemField: UseFieldContext = () => {
    const parent = parentField?.();
    if (!parent) {
      throw new Error('Field.Item must be used within Field.Root');
    }

    const controlId = `field::${parent.ids.control}::item::${props.value}`;
    const labelId = `${controlId}::label`;

    /** Get the control props. */
    const getControlProps = (getParentProps: () => Record<string, unknown>) => ({
      ...getParentProps(),
      id: controlId,
    });

    return {
      ...parent,
      ids: {
        ...parent.ids,
        control: controlId,
        label: labelId,
      },
      /** Get the label props. */
      getLabelProps: () => ({
        ...parent.getLabelProps(),
        id: labelId,
        for: controlId,
      }),
      /** Get the input props. */
      getInputProps: () => ({
        ...getControlProps(parent.getInputProps),
        ...parts.input.attrs(controlId),
      }),
      /** Get the select props. */
      getSelectProps: () => ({
        ...getControlProps(parent.getSelectProps),
        ...parts.select.attrs(controlId),
      }),
      /** Get the textarea props. */
      getTextareaProps: () => ({
        ...getControlProps(parent.getTextareaProps),
        ...parts.textarea.attrs(controlId),
      }),
    } as ReturnType<UseFieldContext>;
  };

  return <FieldProvider value={itemField}>{props.children}</FieldProvider>;
};
