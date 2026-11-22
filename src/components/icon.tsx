import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeSvgChild } from '../styled-system/native-svg-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { SvgChildProps } from '../styled-system/svg-child-props';
import { useIconProps, type IconProps, type IconRootProps } from './icon-props';
import { readIconSize } from './icon-size';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type SizeAttribute =
  'data-size' | 'data-size-sm' | 'data-size-md' | 'data-size-lg' | 'data-size-xl' | 'data-size-2xl';
type IconAttributes = SvgChildProps & {
  focusable?: boolean | 'true' | 'false' | undefined;
  'data-unstyled'?: string | undefined;
} & Partial<Record<SizeAttribute, string | undefined>>;

/** Render the selected native element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & IconAttributes,
) => JSX.Element;

export type { IconProps } from './icon-props';

/** Render a decorative SVG or caller-selected element with authored CSS hooks. */
export function IconRoot(props: IconRootProps): JSX.Element {
  const merged = useIconProps(props);
  const [local, native] = splitProps(merged, [
    'as',
    'asChild',
    'children',
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve one child tree while size and provider defaults change. */
    () => local.children,
  );
  const selectedSize = createMemo(
    /** Validate finite sizes before exposing them to authored CSS. */
    () => readIconSize(local.size),
  );

  /** Forward the mounted element through the native or child-owned path. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, decorative defaults, and size hooks reactive. */
    (): IconAttributes => ({
      ...native,
      width:
        native.width ?? (local.unstyled || (local.as && local.as !== 'svg') ? undefined : '1em'),
      height:
        native.height ?? (local.unstyled || (local.as && local.as !== 'svg') ? undefined : '1em'),
      focusable: native.focusable ?? 'false',
      'aria-hidden': native['aria-hidden'] ?? 'true',
      'data-size': selectedSize().base,
      'data-size-sm': selectedSize().sm,
      'data-size-md': selectedSize().md,
      'data-size-lg': selectedSize().lg,
      'data-size-xl': selectedSize().xl,
      'data-size-2xl': selectedSize()['2xl'],
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('icon', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeSvgChild('Icon', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'svg'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Preserve native props and refs for the selected element. */
export const Icon = IconRoot as <As extends IntrinsicElement = 'svg'>(
  props: IconProps<As>,
) => JSX.Element;
