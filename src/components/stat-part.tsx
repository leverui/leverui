import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { requireStatRoot } from './stat-context';
import type { StatPartRuntimeProps } from './stat-props';

type StatSlot = 'label' | 'valueText' | 'valueUnit' | 'helpText' | 'indicator';

/** Render a selected native part without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a scoped Stat part with native attributes and caller-owned children. */
export function renderStatPart(
  name: string,
  tag: NativeElementTag,
  slot: StatSlot,
  props: StatPartRuntimeProps,
  defaults: JSX.HTMLAttributes<HTMLElement> & { 'data-type'?: string } = {},
  fallback?: () => JSX.Element,
): JSX.Element {
  requireStatRoot();
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
    /** Keep explicit null distinct from an absent default icon. */
    () => (local.children === undefined ? fallback?.() : local.children),
  );

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, semantic defaults, and part selectors reactive. */
    () => ({
      ...defaults,
      ...native,
      class: composeRecipeClassNames(`stat__${slot}`, undefined, local.class, local.className),
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
