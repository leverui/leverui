import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { GetChildProps } from '../styled-system/child-props';
import { requireListRoot } from './list-context';
import type { NativeElementTag } from './native-element-props';
import type { ListIndicatorGetChildProps, ListIndicatorRuntimeProps } from './list-part-props';
import type { ListIndicatorProps } from './list-props';

/** Render a selected native indicator without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an inline marker or caller-owned icon under its List root. */
function ListIndicatorComponent(props: ListIndicatorRuntimeProps): JSX.Element {
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
    /** Keep indicator content stable across native prop changes. */
    () => local.children,
  );

  /** Forward the selected indicator node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep the indicator class and native attributes reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('list__indicator', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  /** Adapt the shared child props to the existing HTML or SVG child contract. */
  function renderSelectedChild(getProps: GetChildProps): JSX.Element {
    if (!local.asChild) throw new Error('ListIndicator child renderer is missing.');
    // The merged runtime attributes work on either element; the public type narrows the selected SVG.
    return local.asChild(getProps as ListIndicatorGetChildProps);
  }

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('ListIndicator', renderSelectedChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native indicator props and caller-owned HTML or SVG rendering. */
export const ListIndicator = ListIndicatorComponent as <As extends NativeElementTag = 'span'>(
  props: ListIndicatorProps<As>,
) => JSX.Element;
