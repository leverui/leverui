import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import { autoresizeTextarea } from '@zag-js/auto-resize';
import { mergeProps } from '../../utils/merge-part-props';
import { onSettled } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export interface FieldTextareaBaseProps extends PolymorphicProps<'textarea'> {
  /**
   * Whether the textarea should autoresize
   * @default false
   */
  autoresize?: boolean;
}
export type FieldTextareaProps = Assign<HTMLProps<'textarea'>, FieldTextareaBaseProps>;

/** Render the Field textarea. */
export const FieldTextarea = (props: FieldTextareaProps) => {
  const field = useFieldContext();
  let textareaRef: HTMLTextAreaElement;
  const [autoresizeProps, textareaProps] = splitProps(props, ['autoresize']);

  const mergedProps = mergeProps(
    () => field?.().getTextareaProps(),
    () => ({ style: { resize: autoresizeProps.autoresize ? 'none' : undefined } }),
    textareaProps,
  );

  onSettled(() => {
    if (!autoresizeProps.autoresize) return;
    const cleanup = autoresizeTextarea(textareaRef);
    return () => cleanup?.();
  });

  return (
    <primitive.textarea
      {...mergedProps}
      ref={composeRefGetters(
        () => (el) => (textareaRef = el),
        () => props.ref,
      )}
    />
  );
};
