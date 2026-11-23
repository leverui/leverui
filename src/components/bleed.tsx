import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { bleedVariableStyle, type BleedSpacingProps } from './bleed-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

interface BleedOptions extends BleedSpacingProps {
  /** Keep the root hook and explicitly requested spacing without default styling. */
  unstyled?: boolean | undefined;
}

export type BleedProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  BleedOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof BleedOptions> &
  BleedOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML tag with native Solid attributes. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Extend content through authored logical-margin CSS and live spacing variables. */
function BleedRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'inline',
    'inlineStart',
    'inlineEnd',
    'block',
    'blockStart',
    'blockEnd',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Resolve caller content once so spacing updates preserve child nodes. */
    () => local.children,
  );

  /** Forward the actual rendered element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, class hooks, and responsive variables reactive. */
    () => ({
      ...native,
      style: bleedVariableStyle(local, native.style),
      class: cx('lui-bleed', local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Bleed', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Bleed attributes and selected-tag refs without object styling. */
export const Bleed = BleedRoot as <As extends NativeElementTag = 'div'>(
  props: BleedProps<As>,
) => JSX.Element;
