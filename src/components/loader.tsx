import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { Spinner } from './spinner';
import { cx } from '../utils/cx';

interface LoaderOptions {
  /** Bypass the loading wrapper when work is complete. */
  visible?: boolean | undefined;
  /** Replace the default indicator; null suppresses it. */
  spinner?: JSX.Element | undefined;
  /** Place the indicator before or after loading text. */
  spinnerPlacement?: 'start' | 'end' | undefined;
  /** Show loading text instead of covering the original child. */
  text?: JSX.Element | undefined;
  /** Suppress the default display and positioning rules. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

export type LoaderProps<As extends NativeElementTag = NativeElementTag> = NativeElementProps<
  'span',
  LoaderOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof LoaderOptions> &
  LoaderOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected HTML tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Compose native loading content with stable authored CSS hooks. */
function LoaderRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'visible',
    'spinner',
    'spinnerPlacement',
    'text',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);

  /** Resolve the default indicator only when no replacement was supplied. */
  function indicator(): JSX.Element {
    return local.spinner === undefined ? (
      <Spinner size="inherit" style={{ 'border-width': '0.125em', color: 'inherit' }} />
    ) : (
      local.spinner
    );
  }

  /** Keep the content order for text and covered-child modes. */
  function content(): JSX.Element {
    const currentIndicator = indicator();
    if (local.text) {
      return (
        <>
          {local.spinnerPlacement !== 'end' && currentIndicator}
          {local.text}
          {local.spinnerPlacement === 'end' && currentIndicator}
        </>
      );
    }
    if (!currentIndicator) return local.children;
    return (
      <>
        <div class="leverui-loader__indicator">{currentIndicator}</div>
        <span class="leverui-loader__content">{local.children}</span>
      </>
    );
  }

  /** Forward the visible wrapper's actual native element. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props and the public class reactive. */
    () => ({
      ...native,
      class: cx('leverui-loader', local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.visible === false ? (
        local.children
      ) : local.asChild ? (
        renderNativeLayoutChild('Loader', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose Loader with native props and a selected-element ref. */
export const Loader = LoaderRoot as <As extends NativeElementTag = 'span'>(
  props: LoaderProps<As>,
) => JSX.Element;
