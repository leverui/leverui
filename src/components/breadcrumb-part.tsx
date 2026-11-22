import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireBreadcrumbRoot } from './breadcrumb-context';
import type { NativeElementTag } from './native-element-props';
import type { BreadcrumbPartRuntimeProps } from './breadcrumb-props';

type BreadcrumbPart = 'link' | 'currentLink' | 'separator' | 'ellipsis';

/** Render a selected native part without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one scoped Breadcrumb part with its native and default attributes. */
export function renderBreadcrumbPart(
  name: string,
  tag: NativeElementTag,
  slot: BreadcrumbPart,
  props: BreadcrumbPartRuntimeProps,
  defaults: JSX.HTMLAttributes<HTMLElement> = {},
  fallback?: () => JSX.Element,
): JSX.Element {
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
  /** Keep caller content ahead of the optional default icon. */
  function content(): JSX.Element {
    return local.children === undefined ? fallback?.() : local.children;
  }

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep default semantics, native props, and public classes reactive. */
    () => ({
      ...defaults,
      ...native,
      class: composeRecipeClassNames(
        `breadcrumb__${slot}`,
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
