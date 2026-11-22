import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { CloseIcon } from './close-icon';
import type { NativeElementTag } from './native-element-props';
import { requireTagRoot } from './tag-context';
import type { TagCloseRuntimeProps, TagCloseTriggerProps } from './tag-props';

/** Render a selected native control without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a keyboard-operable Tag close button with a default icon. */
function TagCloseTriggerComponent(props: TagCloseRuntimeProps): JSX.Element {
  requireTagRoot();
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Treat explicit null as a caller-owned empty control. */
    () => (local.children === undefined ? <CloseIcon /> : local.children),
  );

  /** Forward the selected control to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Preserve button semantics and the default accessible name. */
    () => ({
      ...native,
      type: native.type ?? 'button',
      'aria-label':
        local.children === undefined &&
        native['aria-label'] === undefined &&
        native['aria-labelledby'] === undefined
          ? 'Close'
          : native['aria-label'],
      class: composeRecipeClassNames('tag__closeTrigger', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('TagCloseTrigger', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'button'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native button attributes and caller-owned child rendering. */
export const TagCloseTrigger = TagCloseTriggerComponent as <As extends NativeElementTag = 'button'>(
  props: TagCloseTriggerProps<As>,
) => JSX.Element;
