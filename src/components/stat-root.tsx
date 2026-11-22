import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { StatContextProvider } from './stat-context';
import { useStatProps, type StatRootProps, type StatRootRuntimeProps } from './stat-props';
import { readStatSize, statSizeAttributes } from './stat-size';

/** Render a selected native description list without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render semantic Stat parts with authored, responsive size choices. */
function StatRootComponent(props: StatRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useStatProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const selected = createMemo(
    /** Validate the finite size before reflecting it in public attributes. */
    () => readStatSize(local.size),
  );

  /** Forward the chosen native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and responsive selectors reactive. */
    () => ({
      ...native,
      ...statSizeAttributes(selected()),
      class: composeRecipeClassNames('stat__root', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  /** Resolve descendants under this list's semantic part context. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Keep native content mounted across size changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('StatRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'dl'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(StatContextProvider, {
    value: true,
    /** Mount the description list while its part context is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native description-list attributes and caller-owned child rendering. */
export const StatRoot = StatRootComponent as <As extends NativeElementTag = 'dl'>(
  props: StatRootProps<As>,
) => JSX.Element;
