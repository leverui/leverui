import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { readBadgeSizes } from './badge-size';
import { useBadgeProps, type BadgeBaseProps, type BadgeRootProps } from './badge-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

export type BadgeProps<As extends NativeElementTag = 'span'> = NativeElementProps<
  'span',
  BadgeBaseProps,
  As
>;

/** Render the selected HTML tag without generating presentation rules. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render reactive Badge defaults through authored classes and attributes. */
function BadgeRoot(props: BadgeRootProps): JSX.Element {
  const merged = useBadgeProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'size',
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
  const sizes = createMemo(
    /** Validate each responsive size against the authored CSS selectors. */
    () => readBadgeSizes(local.size),
  );

  /** Forward the actual selected element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props, variants, and palette attributes reactive. */
    () => ({
      ...native,
      class: cx('leverui-badge', local.class),
      'data-size': sizes().base ?? 'sm',
      'data-size-sm': sizes().sm,
      'data-size-md': sizes().md,
      'data-size-lg': sizes().lg,
      'data-size-xl': sizes().xl,
      'data-size-2xl': sizes()['2xl'],
      'data-variant': local.variant ?? 'subtle',
      'data-leverui-color-palette': local.colorPalette,
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Badge', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Badge attributes with precise selected-element props. */
export const Badge = BadgeRoot as <As extends NativeElementTag = 'span'>(
  props: BadgeProps<As>,
) => JSX.Element;
