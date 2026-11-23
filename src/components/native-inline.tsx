import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

type InlineFamily = 'em' | 'strong' | 'quote' | 'visually-hidden';

interface NativeInlineOptions {
  /** Suppress the family's authored presentation rule. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

type ChildProps<Tag extends NativeElementTag> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof NativeInlineOptions | 'ref'
> &
  NativeInlineOptions & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type NativeInlineProps<Tag extends NativeElementTag, As extends NativeElementTag> =
  | Exclude<NativeElementProps<Tag, NativeInlineOptions, As>, { asChild: RenderChild }>
  | ChildProps<Tag>;

export type NativeInlineRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof NativeInlineOptions
> &
  NativeInlineOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one native family with reactive attributes and stable CSS hooks. */
export function renderNativeInline(
  family: InlineFamily,
  tag: NativeElementTag,
  props: NativeInlineRuntimeProps,
): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);

  /** Read consumer content in the selected rendering path. */
  function content(): JSX.Element {
    return local.children;
  }

  /** Forward the actual selected element to the caller. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and consumer classes reactive. */
    () => ({
      ...native,
      class: cx(`lui-${family}`, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(family, local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? tag} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}
