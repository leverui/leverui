import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { breadcrumbAttributes } from './breadcrumb-attributes';
import { readBreadcrumbChoices, readBreadcrumbPalette } from './breadcrumb-choices';
import { BreadcrumbContextProvider } from './breadcrumb-context';
import type { NativeElementTag } from './native-element-props';
import {
  useBreadcrumbRootProps,
  type BreadcrumbRootProps,
  type BreadcrumbRootRuntimeProps,
} from './breadcrumb-props';

/** Render a selected native landmark without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a labelled navigation landmark with authored responsive choices. */
function BreadcrumbRootComponent(props: BreadcrumbRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useBreadcrumbRootProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const choices = createMemo(
    /** Validate finite selections before reflecting them in public attributes. */
    () => readBreadcrumbChoices(local),
  );

  /** Forward the selected landmark node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, palette, and responsive selectors reactive. */
    () => ({
      ...native,
      'aria-label': native['aria-label'] ?? 'breadcrumb',
      ...breadcrumbAttributes(choices()),
      'data-leverui-color-palette': readBreadcrumbPalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('breadcrumb__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Resolve descendants under this navigation landmark's part context. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Preserve native descendants across responsive choice updates. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('BreadcrumbRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'nav'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(BreadcrumbContextProvider, {
    value: true,
    /** Mount the native landmark while its part context is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native navigation attributes and caller-owned child rendering. */
export const BreadcrumbRoot = BreadcrumbRootComponent as <As extends NativeElementTag = 'nav'>(
  props: BreadcrumbRootProps<As>,
) => JSX.Element;
