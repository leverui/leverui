import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { EmptyStateContextProvider } from './empty-state-context';
import { readEmptyStateSize, emptyStateSizeAttributes } from './empty-state-size';
import type { NativeElementTag } from './native-element-props';
import {
  useEmptyStateProps,
  type EmptyStateRootProps,
  type EmptyStateRootRuntimeProps,
} from './empty-state-props';

/** Render a selected native root without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an Empty State root with finite CSS-backed size choices. */
function EmptyStateRootImpl(props: EmptyStateRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useEmptyStateProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const size = createMemo(
    /** Validate responsive sizes before reflecting them in native attributes. */
    () => readEmptyStateSize(local.size),
  );

  /** Forward the selected native root to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep size, consumer props, and CSS hooks reactive. */
    () => ({
      ...native,
      ...emptyStateSizeAttributes(size()),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('empty-state__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Mount native content within its part boundary. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Preserve descendants across size changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('EmptyStateRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(EmptyStateContextProvider, {
    value: true,
    /** Mount the native root while the part context is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native, selected-tag, and caller-owned Empty State roots. */
export const EmptyStateRoot = EmptyStateRootImpl as <As extends NativeElementTag = 'div'>(
  props: EmptyStateRootProps<As>,
) => JSX.Element;
