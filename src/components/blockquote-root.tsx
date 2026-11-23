import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { blockquoteAttributes } from './blockquote-attributes';
import {
  readBlockquoteJustify,
  readBlockquotePalette,
  readBlockquoteVariants,
} from './blockquote-choices';
import { BlockquoteContextProvider } from './blockquote-context';
import type { NativeElementTag } from './native-element-props';
import {
  useBlockquoteProps,
  type BlockquoteRootProps,
  type BlockquoteRootRuntimeProps,
} from './blockquote-props';

/** Render a selected native figure without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a semantic quotation with authored finite styling choices. */
function BlockquoteRootComponent(props: BlockquoteRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useBlockquoteProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'variant',
    'justify',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const variants = createMemo(
    /** Validate responsive treatments before exposing them to CSS. */
    () => readBlockquoteVariants(local.variant),
  );
  const justifications = createMemo(
    /** Keep finite alignment choices reactive at each breakpoint. */
    () => readBlockquoteJustify(local.justify),
  );

  /** Forward the selected native figure node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and authored selectors reactive. */
    () => ({
      ...native,
      ...blockquoteAttributes(variants(), justifications()),
      'data-lui-color-palette': readBlockquotePalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('blockquote__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Keep descendant nodes stable inside their nearest Blockquote scope. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Keep parts mounted across reactive choice changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('BlockquoteRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'figure'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(BlockquoteContextProvider, {
    value: true,
    /** Mount the native figure while its part scope is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native Blockquote attributes and caller-owned child rendering. */
export const BlockquoteRoot = BlockquoteRootComponent as <As extends NativeElementTag = 'figure'>(
  props: BlockquoteRootProps<As>,
) => JSX.Element;
