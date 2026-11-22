import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireDataListRoot } from './data-list-context';
import type { NativeElementTag } from './native-element-props';
import type { DataListPartRuntimeProps } from './data-list-props';

/** Render a selected native part without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a scoped Data List part with native attributes and caller-owned children. */
export function renderDataListPart(
  name: string,
  tag: NativeElementTag,
  slot: 'item' | 'itemLabel' | 'itemValue',
  props: DataListPartRuntimeProps,
): JSX.Element {
  requireDataListRoot();
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
    /** Preserve nested roots and values across native prop updates. */
    () => local.children,
  );

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep consumer attributes and part selectors reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames(`data-list__${slot}`, undefined, local.class, local.className),
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
