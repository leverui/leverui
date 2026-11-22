import { splitProps } from '../primitives/utils/split-props';
import { Combobox as PrimitiveCombobox } from '../primitives/components/combobox';
import { createComponent } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type ComponentProps, type JSX } from '@solidjs/web';

type ContentProps = ComponentProps<typeof PrimitiveCombobox.Content>;

/**
 * Render Command's result surface: the primitive's `Content` around its `List`.
 *
 * The primitive puts the listbox role, keyboard focus, and active descendant on
 * a separate `List` inside `Content`. Lever's `Command.List` stays one public
 * part: the scroll container keeps its class, and the inner list carries the
 * listbox semantics and the accessible name.
 */
export function CommandListPart(props: ContentProps): JSX.Element {
  const [list, content] = splitProps(props, ['children', 'aria-label', 'aria-labelledby']);
  return createComponent(
    PrimitiveCombobox.Content,
    mergeProps(content, {
      /** Put the caller's results inside the primitive's listbox. */
      get children() {
        return createComponent(PrimitiveCombobox.List, {
          class: 'leverui-command__listbox',
          /** Name the listbox itself rather than its scroll container. */
          get 'aria-label'() {
            return list['aria-label'];
          },
          /** Name the listbox itself rather than its scroll container. */
          get 'aria-labelledby'() {
            return list['aria-labelledby'];
          },
          /** Read the caller's results inside the listbox. */
          get children() {
            return list.children;
          },
        });
      },
    }),
  );
}
