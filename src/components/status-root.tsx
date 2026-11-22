import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { StatusContextProvider } from './status-context';
import { readStatusPalette } from './status-palette';
import { useStatusProps, type StatusRootProps, type StatusRootRuntimeProps } from './status-props';
import { readStatusSize, statusSizeAttributes } from './status-size';

/** Render a selected native element without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an inline status with authored size and palette selectors. */
function StatusRootComponent(props: StatusRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useStatusProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const selected = createMemo(
    /** Validate size choices before reflecting them in public attributes. */
    () => readStatusSize(local.size),
  );

  /** Forward the selected native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props, palette, and breakpoint selectors reactive. */
    () => ({
      ...native,
      ...statusSizeAttributes(selected()),
      'data-leverui-color-palette': readStatusPalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('status__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Resolve indicators inside this root's semantic scope. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Keep the native content mounted across provider updates. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('StatusRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(StatusContextProvider, {
    value: true,
    /** Mount the native root while its indicator context is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native Status attributes and caller-owned child rendering. */
export const StatusRoot = StatusRootComponent as <As extends NativeElementTag = 'div'>(
  props: StatusRootProps<As>,
) => JSX.Element;
