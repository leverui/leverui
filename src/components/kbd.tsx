import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { readKbdChoices } from './kbd-choices';
import { useKbdProps, type KbdBaseProps, type KbdRootProps } from './kbd-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

type KbdChildProps = Omit<JSX.IntrinsicElements['kbd'], keyof KbdBaseProps | 'ref'> &
  KbdBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type KbdProps<As extends NativeElementTag = 'kbd'> =
  Exclude<NativeElementProps<'kbd', KbdBaseProps, As>, { asChild: RenderChild }> | KbdChildProps;

/** Render the selected native tag without creating presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a semantic key label through authored classes and finite attributes. */
function KbdRoot(props: KbdRootProps): JSX.Element {
  const merged = useKbdProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Resolve the caller's or provider's content once for this instance. */
    () => local.children,
  );
  const choices = createMemo(
    /** Validate responsive selections against authored Kbd CSS. */
    () => readKbdChoices(local.size, local.variant),
  );

  /** Forward the selected element to this instance's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and finite presentation choices reactive. */
    () => ({
      ...native,
      class: cx('lui-kbd', local.class, local.className),
      'data-size': choices().size.base,
      'data-size-sm': choices().size.sm,
      'data-size-md': choices().size.md,
      'data-size-lg': choices().size.lg,
      'data-size-xl': choices().size.xl,
      'data-size-2xl': choices().size['2xl'],
      'data-variant': choices().variant.base,
      'data-variant-sm': choices().variant.sm,
      'data-variant-md': choices().variant.md,
      'data-variant-lg': choices().variant.lg,
      'data-variant-xl': choices().variant.xl,
      'data-variant-2xl': choices().variant['2xl'],
      'data-lui-color-palette': local.colorPalette,
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Kbd', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'kbd'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Kbd props with a ref matching the selected tag. */
export const Kbd = KbdRoot as <As extends NativeElementTag = 'kbd'>(
  props: KbdProps<As>,
) => JSX.Element;
