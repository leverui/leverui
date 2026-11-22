import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { textStyleAttributes, type TextStyleProps } from '../styled-system/text-style';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type NativeSpanProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], 'as' | 'asChild'> &
      TextStyleProps &
      (As extends 'span' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type SpanChildProps = Omit<JSX.IntrinsicElements['span'], 'ref'> &
  TextStyleProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type SpanProps<As extends IntrinsicElement = 'span'> = NativeSpanProps<As> | SpanChildProps;

type SpanRuntimeProps = JSX.HTMLAttributes<HTMLElement> &
  TextStyleProps & {
    as?: IntrinsicElement | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected native inline element without generated CSS. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an inline element with one stable public class and native attributes. */
function SpanRoot(props: SpanRuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'textStyle',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Resolve caller content once while native attributes change. */
    () => local.children,
  );

  /** Forward the selected element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and consumer classes reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('span', undefined, local.class, local.className),
      ...textStyleAttributes(local.textStyle),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Span', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native props with a ref matching the selected element. */
export const Span = SpanRoot as <As extends IntrinsicElement = 'span'>(
  props: SpanProps<As>,
) => JSX.Element;
