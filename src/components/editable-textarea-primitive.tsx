import { useEditableContext as usePrimitiveEditableContext } from '../primitives/components/editable';
import { useFieldContext } from '../primitives/components/field';
import { primitive, type HTMLPrimitiveProps } from '../primitives/components/factory';
import { mergeProps as mergeZagProps } from '../primitives/utils/merge-part-props';
import { createComponent, createMemo } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';

/** Render a textarea using Editable's input behavior and Field association. */
export function EditableTextareaPrimitive(props: HTMLPrimitiveProps<'textarea'>): JSX.Element {
  const editable = usePrimitiveEditableContext();
  const field = useFieldContext();
  const input = createMemo(
    /** Keep the textarea's native attributes synchronized with Zag. */
    () => editable().getInputProps(),
  );
  const textareaInputProps = createMemo(
    /** Reuse Zag's input state without forwarding its input-only type attribute. */
    () => {
      const inputProps = { ...input() };
      delete inputProps.type;
      return inputProps;
    },
  );
  const merged = createMemo(
    /** Compose machine and caller events while tracking state and Field links. */
    () =>
      mergeZagProps(
        { 'aria-describedby': field?.().ariaDescribedby },
        textareaInputProps(),
        props,
        { children: input().value },
      ),
  );

  const renderedProps = mergeProps(
    /** Expose the tracked merged props to the primitive's textarea factory. */
    () => merged(),
  );
  // Zag's input prop set is valid for textarea after removing its type attribute.
  return createComponent(primitive.textarea, renderedProps as HTMLPrimitiveProps<'textarea'>);
}
