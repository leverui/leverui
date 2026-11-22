import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { useLinkProps, type LinkBaseProps, type LinkRootProps } from './link-props';
import { readLinkVariants } from './link-variant';

export type LinkProps<As extends NativeElementTag = 'a'> = NativeElementProps<
  'a',
  LinkBaseProps,
  As
>;

/** Render a selected native element without inserting presentation styles. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render native navigation with authored variants and palette attributes. */
function LinkRoot(props: LinkRootProps): JSX.Element {
  const merged = useLinkProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve each anchor's own label across provider updates. */
    () => local.children,
  );
  const variants = createMemo(
    /** Validate responsive Link treatments against authored selectors. */
    () => readLinkVariants(local.variant),
  );

  /** Deliver the selected native element to the consumer's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props, variants, palette, and classes reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('link', undefined, local.class, local.className),
      'data-variant': variants().base ?? 'plain',
      'data-variant-sm': variants().sm,
      'data-variant-md': variants().md,
      'data-variant-lg': variants().lg,
      'data-variant-xl': variants().xl,
      'data-variant-2xl': variants()['2xl'],
      'data-leverui-color-palette': local.colorPalette,
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Link', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'a'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Link attributes, selected tags, and caller-owned children. */
export const Link = LinkRoot as <As extends NativeElementTag = 'a'>(
  props: LinkProps<As>,
) => JSX.Element;
