import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

interface ProseOptions {
  /** Select the typography scale. */
  size?: 'md' | 'lg' | undefined;
  /** Suppress authored typography while retaining the public class. */
  unstyled?: boolean | undefined;
  /** Accept Solid's className alias. */
  className?: string | undefined;
}

export type ProseProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  ProseOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  ProseOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected HTML element with native attributes. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render semantic content with scoped typography from the authored stylesheet. */
function ProseRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);

  /** Read content through either rendering path. */
  function readContent(): JSX.Element {
    return local.children;
  }

  /** Forward the selected element to the consumer. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and typography choices reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('prose', undefined, cx(local.class, local.className)),
      'data-size': local.size ?? 'md',
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Prose', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned Prose props. */
export const Prose = ProseRoot as <As extends NativeElementTag = 'div'>(
  props: ProseProps<As>,
) => JSX.Element;
