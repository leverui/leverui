import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireBlockquoteRoot } from './blockquote-context';
import type { NativeElementTag } from './native-element-props';
import type { BlockquotePartRuntimeProps } from './blockquote-props';

type BlockquotePart = 'content' | 'caption';

/** Render a selected native part without component style tags. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one quote part with stable classes and native attributes. */
export function renderBlockquotePart(
  name: string,
  tag: NativeElementTag,
  slot: BlockquotePart,
  props: BlockquotePartRuntimeProps,
): JSX.Element {
  requireBlockquoteRoot();
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
    /** Keep the quoted text mounted through reactive parent changes. */
    () => local.children,
  );

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep caller attributes and the public part hook reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames(
        `blockquote__${slot}`,
        undefined,
        local.class,
        local.className,
      ),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(name, local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? tag} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}
