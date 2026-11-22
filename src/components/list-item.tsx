import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireListRoot } from './list-context';
import type { NativeElementTag } from './native-element-props';
import type { ListPartRuntimeProps } from './list-part-props';
import type { ListItemProps } from './list-props';

/** Render a selected native item without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one semantic item under its nearest List root. */
function ListItemComponent(props: ListPartRuntimeProps): JSX.Element {
  requireListRoot();
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
    /** Preserve nested lists when native item props update. */
    () => local.children,
  );

  /** Forward the selected item node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep the item class and native attributes reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('list__item', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('ListItem', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'li'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native item attributes and caller-owned child rendering. */
export const ListItem = ListItemComponent as <As extends NativeElementTag = 'li'>(
  props: ListItemProps<As>,
) => JSX.Element;
