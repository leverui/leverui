import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import {
  skipNavTargetId,
  type SkipNavContentProps,
  type SkipNavRuntimeProps,
} from './skip-nav-props';

/** Render the selected native destination without presentation styles. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a programmatically focusable destination for the skip link. */
function SkipNavContentRoot(props: SkipNavRuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'id',
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve destination children across reactive ID changes. */
    () => local.children,
  );

  /** Deliver the selected destination to the consumer's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep the native destination, focusability, and classes reactive. */
    () => ({
      ...native,
      id: local.id ?? skipNavTargetId,
      tabindex: native.tabindex ?? -1,
      class: composeRecipeClassNames('skip-nav-content', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('SkipNavContent', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native destination attributes, selected tags, and children. */
export const SkipNavContent = SkipNavContentRoot as <As extends NativeElementTag = 'div'>(
  props: SkipNavContentProps<As>,
) => JSX.Element;
