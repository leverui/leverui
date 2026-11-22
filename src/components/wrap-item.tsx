import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface WrapItemOptions {
  /** Suppress default item alignment while retaining the public class. */
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  WrapItemOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a native WrapItem without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type WrapItemProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  WrapItemOptions,
  As
>;

/** Render one flex child aligned to the start of its wrap line. */
function WrapItemRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Keep the child mounted while WrapItem styles change. */
    () => local.children,
  );
  /** Read the mounted child through either rendering path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the mounted native element to the caller's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep the native attributes and public class reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('wrap__listitem', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('WrapItem', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected WrapItem element. */
export const WrapItem = WrapItemRoot as <As extends NativeElementTag = 'div'>(
  props: WrapItemProps<As>,
) => JSX.Element;
