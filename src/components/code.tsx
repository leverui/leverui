import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { readBadgeSizes } from './badge-size';
import { useCodeProps, type CodeBaseProps, type CodeRootProps } from './code-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

export type CodeProps<As extends NativeElementTag = 'code'> = NativeElementProps<
  'code',
  CodeBaseProps,
  As
>;

/** Render a selected native tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render inline Code through authored classes and finite attributes. */
function CodeRoot(props: CodeRootProps): JSX.Element {
  const merged = useCodeProps(props);
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
    /** Resolve caller content once while provider defaults change. */
    () => local.children,
  );
  const sizes = createMemo(
    /** Validate responsive sizes against the shared authored Badge CSS. */
    () => readBadgeSizes(local.size),
  );

  /** Forward the actual selected element to the caller's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, size, variant, and palette reactive. */
    () => ({
      ...native,
      class: cx('leverui-code', local.class, local.className),
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
        renderNativeLayoutChild('Code', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'code'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Code props with a ref matching the selected tag. */
export const Code = CodeRoot as <As extends NativeElementTag = 'code'>(
  props: CodeProps<As>,
) => JSX.Element;
