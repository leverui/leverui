import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import {
  StatPropsProvider,
  type StatGroupProps,
  type StatRootBaseProps,
  type StatRootRuntimeProps,
} from './stat-props';

/** Render a selected native group element without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Group several statistics and share a reactive default size. */
function StatGroupComponent(props: StatRootRuntimeProps): JSX.Element {
  const [contentProps, rest] = splitProps(props, ['children', 'asChild']);
  const [local, native] = splitProps(rest, ['as', 'size', 'unstyled', 'class', 'className', 'ref']);

  /** Forward the chosen native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  /** Share the current group size with descendant Stat roots. */
  function readDefaults(): StatRootBaseProps {
    return { size: local.size };
  }

  const attributes = createMemo(
    /** Keep native group attributes and authored class hooks reactive. */
    () => ({
      ...native,
      role: native.role ?? 'group',
      class: composeRecipeClassNames('stat__group', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  /** Resolve group children inside their size provider. */
  function renderGroup(): JSX.Element {
    const content = children(
      /** Keep root nodes mounted across group size changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('StatGroup', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(StatPropsProvider, {
    value: readDefaults,
    /** Mount grouped Stat roots under their shared size defaults. */
    get children() {
      return renderGroup();
    },
  });
}

/** Expose native group attributes and caller-owned child rendering. */
export const StatGroup = StatGroupComponent as <As extends NativeElementTag = 'div'>(
  props: StatGroupProps<As>,
) => JSX.Element;
