import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { readTextClamp, readTextTruncate, textClippingStyle } from './text-clipping';
import { useTextProps, type TextProps, type TextRuntimeProps } from './text-props';
import { textStyleAttributes } from '../styled-system/text-style';

type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a selected intrinsic element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render native text with authored clipping selectors and live defaults. */
function TextRoot(props: TextRuntimeProps): JSX.Element {
  const merged = useTextProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'truncate',
    'lineClamp',
    'unstyled',
    'textStyle',
    'class',
    'className',
    'style',
    'ref',
  ]);
  const content = children(
    /** Resolve caller content once while attributes and defaults change. */
    () => local.children,
  );
  const clamp = createMemo(
    /** Validate the scalar clamp before exposing it to CSS. */
    () => readTextClamp(local.lineClamp),
  );

  /** Forward the selected native element to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and authored clipping choices reactive. */
    () => {
      const style = textClippingStyle(local.style, clamp());
      return {
        ...native,
        ...(style === undefined ? {} : { style }),
        class: composeRecipeClassNames('text', undefined, local.class, local.className),
        'data-truncate': readTextTruncate(local.truncate) ? '' : undefined,
        'data-line-clamp': clamp()?.kind,
        'data-unstyled': local.unstyled ? '' : undefined,
        ...textStyleAttributes(local.textStyle),
        ref: attachNode,
      };
    },
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Text', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'p'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Text props with the selected element's ref type. */
export const Text = TextRoot as <As extends IntrinsicElement = 'p'>(
  props: TextProps<As>,
) => JSX.Element;

export { TextPropsProvider } from './text-props';
export type { TextProps, TextPropsProviderProps } from './text-props';
