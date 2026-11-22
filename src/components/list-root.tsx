import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { readListAlignments, readListVariants } from './list-choices';
import { ListContextProvider } from './list-context';
import type { NativeElementTag } from './native-element-props';
import { useListProps, type ListRootProps, type ListRootRuntimeProps } from './list-props';

/** Render a selected native list without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a semantic list with authored variants and scoped parts. */
function ListRootComponent(props: ListRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useListProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'variant',
    'align',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const variants = createMemo(
    /** Validate treatments before reflecting them in public attributes. */
    () => readListVariants(local.variant),
  );
  const alignments = createMemo(
    /** Keep finite alignment choices reactive at each breakpoint. */
    () => readListAlignments(local.align),
  );

  /** Forward the selected list node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and authored CSS selectors reactive. */
    () => ({
      ...native,
      role: native.role ?? 'list',
      class: composeRecipeClassNames('list__root', undefined, local.class, local.className),
      'data-variant': variants().base,
      'data-variant-sm': variants().sm,
      'data-variant-md': variants().md,
      'data-variant-lg': variants().lg,
      'data-variant-xl': variants().xl,
      'data-variant-2xl': variants()['2xl'],
      'data-align': alignments().base,
      'data-align-sm': alignments().sm,
      'data-align-md': alignments().md,
      'data-align-lg': alignments().lg,
      'data-align-xl': alignments().xl,
      'data-align-2xl': alignments()['2xl'],
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  /** Resolve descendants under the nearest List root context. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Keep nested lists and indicator children stable across updates. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('ListRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'ul'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(ListContextProvider, {
    value: true,
    /** Mount the native list while its part context is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native List attributes, selected tags, and caller-owned children. */
export const ListRoot = ListRootComponent as <As extends NativeElementTag = 'ul'>(
  props: ListRootProps<As>,
) => JSX.Element;
