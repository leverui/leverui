import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useHeadingProps, type HeadingProps, type HeadingRootProps } from './heading-props';
import { readHeadingSizes } from './heading-size';

type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a selected native element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render semantic heading content with authored typography selectors. */
function HeadingRoot(props: HeadingRootProps): JSX.Element {
  const merged = useHeadingProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Resolve caller content once while choices and defaults change. */
    () => local.children,
  );
  const sizes = createMemo(
    /** Validate the finite selection before binding native attributes. */
    () => readHeadingSizes(local.size),
  );

  /** Forward the selected native element to the consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and responsive sizes reactive. */
    () => {
      const selected = sizes();
      return {
        ...native,
        class: composeRecipeClassNames('heading', undefined, local.class, local.className),
        'data-size': selected.base,
        'data-size-sm': selected.sm,
        'data-size-md': selected.md,
        'data-size-lg': selected.lg,
        'data-size-xl': selected.xl,
        'data-size-2xl': selected['2xl'],
        'data-unstyled': local.unstyled ? '' : undefined,
        ref: attachNode,
      };
    },
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Heading', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'h2'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Heading props with the selected element's ref type. */
export const Heading = HeadingRoot as <As extends IntrinsicElement = 'h2'>(
  props: HeadingProps<As>,
) => JSX.Element;

export type { HeadingProps } from './heading-props';
