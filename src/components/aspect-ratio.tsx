import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { requireSingleChild } from './aspect-ratio-child';
import {
  aspectRatioVariableStyle,
  ratioPadding,
  type ResponsiveRatio,
} from './aspect-ratio-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

interface RatioOptions {
  /** Select a positive width-to-height ratio at ordinary breakpoints. */
  ratio?: ResponsiveRatio | undefined;
  /** Suppress default layout while retaining the public root hook. */
  unstyled?: boolean | undefined;
  /** The single element positioned within the ratio box. */
  children: JSX.Element;
  /** Use `ratio` for this component's geometry. */
  aspectRatio?: never;
}

export type AspectRatioProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  RatioOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof RatioOptions> &
  RatioOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Position one child through authored CSS and native responsive variables. */
function AspectRatioRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'ratio',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Resolve child JSX lazily so ratio updates preserve its native node. */
    () => local.children,
  );
  const validContent = createMemo(
    /** Require one native element across client and server rendering. */
    () => requireSingleChild(content),
  );
  const padding = createMemo(
    /** Keep responsive spacer values in sync with the public ratio prop. */
    () => ratioPadding(local.ratio ?? 4 / 3),
  );

  /** Forward the actual rendered element to the callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Forward native attributes, CSS hooks, and live ratio variables. */
    () => ({
      ...native,
      style: aspectRatioVariableStyle(padding(), native.style),
      class: cx('leverui-aspect-ratio', local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('AspectRatio', local.asChild, attributes, validContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {validContent()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose the selected native element while preserving the ratio contract. */
export const AspectRatio = AspectRatioRoot as <As extends NativeElementTag = 'div'>(
  props: AspectRatioProps<As>,
) => JSX.Element;
