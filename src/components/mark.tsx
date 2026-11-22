import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { useMarkProps, type MarkBaseProps, type MarkRootProps } from './mark-props';
import { readMarkVariants } from './mark-variant';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

export type MarkProps<As extends NativeElementTag = 'mark'> = NativeElementProps<
  'mark',
  MarkBaseProps,
  As
>;

/** Render the selected native tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render native emphasis with authored Mark selectors and live defaults. */
function MarkRoot(props: MarkRootProps): JSX.Element {
  const merged = useMarkProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Resolve caller content once while provider defaults change. */
    () => local.children,
  );
  const variants = createMemo(
    /** Validate responsive choices against the authored CSS. */
    () => readMarkVariants(local.variant),
  );

  /** Forward the actual selected element to its caller's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, treatment, and palette reactive. */
    () => ({
      ...native,
      class: cx('leverui-mark', local.class),
      'data-variant': variants().base,
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
        renderNativeLayoutChild('Mark', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'mark'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Mark props with a ref matching the selected element. */
export const Mark = MarkRoot as <As extends NativeElementTag = 'mark'>(
  props: MarkProps<As>,
) => JSX.Element;
