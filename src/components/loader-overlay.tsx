import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

interface LoaderOverlayOptions {
  /** Suppress the default full-size overlay presentation. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

export type LoaderOverlayProps<As extends NativeElementTag = NativeElementTag> = NativeElementProps<
  'div',
  LoaderOverlayOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof LoaderOverlayOptions> &
  LoaderOverlayOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML tag without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Cover the nearest positioned ancestor through an authored CSS class. */
function LoaderOverlayRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);

  /** Return caller content from the selected rendering path. */
  function content(): JSX.Element {
    return local.children;
  }

  /** Forward the rendered overlay element to its callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Preserve native attributes and reactive consumer classes. */
    () => ({
      ...native,
      class: cx('lui-loader-overlay', local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('LoaderOverlay', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose overlay composition through native props and selected-element refs. */
export const LoaderOverlay = LoaderOverlayRoot as <As extends NativeElementTag = 'div'>(
  props: LoaderOverlayProps<As>,
) => JSX.Element;
