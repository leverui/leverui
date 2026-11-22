import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { skipNavTargetId, type SkipNavLinkProps, type SkipNavRuntimeProps } from './skip-nav-props';

/** Render the selected native link without inserting presentation styles. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a focus-revealed link to the matching SkipNavContent target. */
function SkipNavLinkRoot(props: SkipNavRuntimeProps): JSX.Element {
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
    /** Preserve one child across reactive target changes. */
    () => local.children,
  );

  /** Deliver the selected native element to the consumer's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and the destination reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('skip-nav', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      href: `#${local.id ?? skipNavTargetId}`,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('SkipNavLink', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'a'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native link attributes, selected tags, and caller-owned children. */
export const SkipNavLink = SkipNavLinkRoot as <As extends NativeElementTag = 'a'>(
  props: SkipNavLinkProps<As>,
) => JSX.Element;
