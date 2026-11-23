import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

type CenterAxis = 'horizontal' | 'vertical' | 'both';

interface CenterOptions {
  /** Choose the axes centered within the nearest positioned ancestor. */
  axis?: CenterAxis | undefined;
  /** Keep the public hook while suppressing the default positioning CSS. */
  unstyled?: boolean | undefined;
}

export type AbsoluteCenterProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  CenterOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  CenterOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML tag without a presentation runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Position native or caller-owned content through authored CSS. */
function AbsoluteCenterRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'axis',
    'unstyled',
    'class',
    'ref',
  ]);

  /** Follow caller content through native and child-rendered paths. */
  function content(): JSX.Element {
    return local.children;
  }

  /** Forward the rendered element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and axis selection reactive. */
    () => ({
      ...native,
      class: cx('lui-absolute-center', local.class),
      'data-axis': local.axis ?? 'both',
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('AbsoluteCenter', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native positioning hooks with precise selected-element props. */
export const AbsoluteCenter = AbsoluteCenterRoot as <As extends NativeElementTag = 'div'>(
  props: AbsoluteCenterProps<As>,
) => JSX.Element;
