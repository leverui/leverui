import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireBreadcrumbRoot } from './breadcrumb-context';
import type { NativeElementTag } from './native-element-props';
import type { BreadcrumbItemProps, BreadcrumbPartRuntimeProps } from './breadcrumb-props';

/** Render a selected native list item without presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one location inside the ordered Breadcrumb list. */
function BreadcrumbItemComponent(props: BreadcrumbPartRuntimeProps): JSX.Element {
  requireBreadcrumbRoot();
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
    /** Preserve link and current-page descendants across updates. */
    () => local.children,
  );

  /** Forward the selected item node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and the stable item class reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('breadcrumb__item', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('BreadcrumbItem', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'li'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native item attributes and caller-owned child rendering. */
export const BreadcrumbItem = BreadcrumbItemComponent as <As extends NativeElementTag = 'li'>(
  props: BreadcrumbItemProps<As>,
) => JSX.Element;
