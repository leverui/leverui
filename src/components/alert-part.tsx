import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useAlertContext } from './alert-context';
import type { NativeElementTag } from './native-element-props';
import type { AlertPartRuntimeProps } from './alert-props';

export type AlertPartName = 'indicator' | 'content' | 'title' | 'description';

/** Render a selected native part without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a scoped Alert part with native attributes and stable CSS hooks. */
export function renderAlertPart(
  name: string,
  slot: AlertPartName,
  tag: NativeElementTag,
  props: AlertPartRuntimeProps,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  useAlertContext();
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = defaultChildren
    ? children(
        /** Prefer explicit empty content to the default indicator glyph. */
        () => (local.children === undefined ? defaultChildren() : local.children),
      )
    : children(
        /** Preserve ordinary part children without a fallback branch. */
        () => local.children,
      );
  /** Forward the selected native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and public part hooks reactive. */
    () => ({
      ...native,
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames(`alert__${slot}`, undefined, local.class, local.className),
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
