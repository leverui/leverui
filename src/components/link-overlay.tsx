import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import type { LinkPartOptions, LinkPartRuntimeProps } from './link-part-props';

export type LinkOverlayProps<As extends NativeElementTag = 'a'> = NativeElementProps<
  'a',
  LinkPartOptions,
  As
>;

/** Render the selected native overlay without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Stretch a native anchor over its nearest positioned LinkBox. */
function LinkOverlayRoot(props: LinkPartRuntimeProps): JSX.Element {
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
    /** Keep the overlay's child stable across native prop changes. */
    () => local.children,
  );

  /** Forward the selected anchor to the consumer's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and unstyled state reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('linkbox__overlay', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('LinkOverlay', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'a'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native overlay attributes, selected tags, and caller-owned children. */
export const LinkOverlay = LinkOverlayRoot as <As extends NativeElementTag = 'a'>(
  props: LinkOverlayProps<As>,
) => JSX.Element;
