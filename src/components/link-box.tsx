import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import type { LinkPartOptions, LinkPartRuntimeProps } from './link-part-props';

export type LinkBoxProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  LinkPartOptions,
  As
>;

/** Render the selected native container without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Position a stretched link while keeping independent links above it. */
function LinkBoxRoot(props: LinkPartRuntimeProps): JSX.Element {
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
    /** Keep the card's children stable across native prop changes. */
    () => local.children,
  );

  /** Forward the selected container to the consumer's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and unstyled state reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('linkbox', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('LinkBox', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native container attributes, selected tags, and caller-owned children. */
export const LinkBox = LinkBoxRoot as <As extends NativeElementTag = 'div'>(
  props: LinkBoxProps<As>,
) => JSX.Element;
