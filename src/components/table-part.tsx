import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireTableRoot } from './table-context';
import type { NativeElementTag } from './native-element-props';
import type { TablePartRuntimeProps } from './table-props';

type TableSlot =
  'header' | 'body' | 'footer' | 'row' | 'columnHeader' | 'cell' | 'caption' | 'columnGroup';

/** Render a selected native Table part without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a Table part with stable classes and native attributes. */
export function renderTablePart(
  name: string,
  tag: NativeElementTag,
  slot: TableSlot,
  props: TablePartRuntimeProps,
): JSX.Element {
  requireTableRoot();
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'captionSide',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Keep native descendants mounted across part attribute updates. */
    () => local.children,
  );

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and the public part hook reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames(`table__${slot}`, undefined, local.class, local.className),
      'data-caption-side': slot === 'caption' ? (local.captionSide ?? 'bottom') : undefined,
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
