import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { useSpinnerProps, type SpinnerBaseProps, type SpinnerRootProps } from './spinner-props';
import { readSpinnerSizes } from './spinner-size';

type SpinnerChildProps = Omit<JSX.IntrinsicElements['span'], keyof SpinnerBaseProps | 'ref'> &
  SpinnerBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

type SpinnerSvgProps = Omit<JSX.IntrinsicElements['svg'], keyof SpinnerBaseProps | 'ref'> &
  SpinnerBaseProps & {
    as: 'svg';
    asChild?: never;
    ref?: ((element: SVGSVGElement) => void) | undefined;
  };

type SpinnerTag = NativeElementTag | 'svg';

export type SpinnerProps<As extends SpinnerTag = 'span'> =
  | Exclude<
      NativeElementProps<'span', SpinnerBaseProps, Extract<As, NativeElementTag>>,
      { asChild: RenderChild }
    >
  | SpinnerChildProps
  | SpinnerSvgProps;

/** Render a selected native tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: SpinnerTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render Spinner through authored size attributes and a stable class. */
function SpinnerRoot(props: SpinnerRootProps): JSX.Element {
  const merged = useSpinnerProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'size',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const sizes = createMemo(
    /** Keep authored breakpoint selections reactive. */
    () => readSpinnerSizes(local.size),
  );

  /** Forward the selected element to this instance's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  /** Read consumer content only when the chosen rendering path needs it. */
  function readContent(): JSX.Element {
    return local.children;
  }

  const attributes = createMemo(
    /** Keep native attributes and CSS size hooks reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('spinner', undefined, local.class, local.className),
      'data-size': sizes().base,
      'data-size-sm': sizes().sm,
      'data-size-md': sizes().md,
      'data-size-lg': sizes().lg,
      'data-size-xl': sizes().xl,
      'data-size-2xl': sizes()['2xl'],
      'data-leverui-color-palette': local.colorPalette,
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Spinner', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Expose Spinner props with a ref matching the selected native element. */
export const Spinner = SpinnerRoot as <As extends SpinnerTag = 'span'>(
  props: SpinnerProps<As>,
) => JSX.Element;
