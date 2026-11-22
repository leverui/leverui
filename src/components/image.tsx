import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import {
  imageFitAttributes,
  imagePositionStyle,
  type ImageFit,
  type ImagePosition,
} from './image-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface ImageOptions {
  /** Fit the image within its CSS box at ordinary breakpoints. */
  fit?: ImageFit | undefined;
  /** Position the image content within its CSS box. */
  align?: ImagePosition | undefined;
  /** Set the native width attribute independently of CSS width. */
  htmlWidth?: string | number | undefined;
  /** Set the native height attribute independently of CSS height. */
  htmlHeight?: string | number | undefined;
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | 'align'> &
  ImageOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected native tag without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type ImageProps<As extends NativeElementTag = 'img'> = NativeElementProps<
  'img',
  ImageOptions,
  As
>;

/** Render a native image with authored fit rules and native attributes. */
function ImageRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'fit',
    'align',
    'htmlWidth',
    'htmlHeight',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Preserve caller-owned child content across reactive Image updates. */
    () => local.children,
  );

  /** Read content for the caller-owned element path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the selected native element to the consumer. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep fit, position, native attributes, and classes reactive. */
    () => ({
      ...native,
      ...imageFitAttributes(local.fit),
      ...(local.htmlWidth === undefined ? {} : { width: local.htmlWidth }),
      ...(local.htmlHeight === undefined ? {} : { height: local.htmlHeight }),
      style: imagePositionStyle(local.align, native.style),
      class: composeRecipeClassNames('image', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );
  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Image', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'img'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected image element. */
export const Image = ImageRoot as <As extends NativeElementTag = 'img'>(
  props: ImageProps<As>,
) => JSX.Element;
