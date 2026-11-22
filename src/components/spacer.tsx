import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { spacerFlexAttributes, spacerVariableStyle, type SpacerFlex } from './spacer-layout';

interface SpacerOptions {
  /** Choose the flex weight at supported breakpoints. */
  flex?: SpacerFlex | undefined;
  /** Suppress the default layout rule while retaining the public hook. */
  unstyled?: boolean | undefined;
}

export type SpacerProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  SpacerOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  SpacerOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Fill flex space with authored CSS and native CSS variables. */
function SpacerRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'flex',
    'unstyled',
    'class',
    'ref',
  ]);

  /** Read caller content through the native or child-owned path. */
  function readContent(): JSX.Element {
    return local.children;
  }

  /** Forward the selected element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Bind reactive native attributes and flex choices to the same element. */
    () => ({
      ...native,
      ...spacerFlexAttributes(local.flex),
      style: spacerVariableStyle(local.flex, native.style),
      class: composeRecipeClassNames('spacer', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Spacer', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned Spacer props. */
export const Spacer = SpacerRoot as <As extends NativeElementTag = 'div'>(
  props: SpacerProps<As>,
) => JSX.Element;
