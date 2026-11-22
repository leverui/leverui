import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useCardUnstyled } from './card-context';
import type { NativeElementTag } from './native-element-props';
import type { CardPartRuntimeProps } from './card-props';

type CardPart = 'body' | 'header' | 'footer' | 'title' | 'description';

/** Render the selected native Card part without inserted presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a Card part with stable CSS hooks and native attributes. */
export function renderCardPart(
  slot: CardPart,
  tag: NativeElementTag,
  props: CardPartRuntimeProps,
): JSX.Element {
  const rootUnstyled = useCardUnstyled();
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
    /** Keep part content mounted as native attributes change. */
    () => local.children,
  );

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep caller attributes, unstyled state, and public part hook reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames(`card__${slot}`, undefined, local.class, local.className),
      'data-unstyled': local.unstyled || rootUnstyled() ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(`Card${slot}`, local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? tag} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}
