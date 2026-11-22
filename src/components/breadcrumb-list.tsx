import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireBreadcrumbRoot } from './breadcrumb-context';
import type { NativeElementTag } from './native-element-props';
import type { BreadcrumbListProps, BreadcrumbPartRuntimeProps } from './breadcrumb-props';

/** Render a selected native ordered list without presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render the ordered list that contains Breadcrumb items. */
function BreadcrumbListComponent(props: BreadcrumbPartRuntimeProps): JSX.Element {
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
    /** Keep list descendants stable across native attribute updates. */
    () => local.children,
  );

  /** Forward the chosen list element to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and the stable list class reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('breadcrumb__list', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('BreadcrumbList', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'ol'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native ordered-list attributes and caller-owned children. */
export const BreadcrumbList = BreadcrumbListComponent as <As extends NativeElementTag = 'ol'>(
  props: BreadcrumbListProps<As>,
) => JSX.Element;
