import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireEmptyStateRoot } from './empty-state-context';
import type { NativeElementTag } from './native-element-props';
import type {
  EmptyStateContentProps,
  EmptyStateDescriptionProps,
  EmptyStateIndicatorProps,
  EmptyStatePartRuntimeProps,
  EmptyStateTitleProps,
} from './empty-state-props';

type EmptyStatePart = 'content' | 'indicator' | 'title' | 'description';

/** Render a selected native part without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one scoped Empty State part with native props and stable hooks. */
function renderEmptyStatePart(
  name: string,
  slot: EmptyStatePart,
  tag: NativeElementTag,
  props: EmptyStatePartRuntimeProps,
): JSX.Element {
  requireEmptyStateRoot();
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve native child content across local prop updates. */
    () => local.children,
  );

  /** Forward the selected part node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and public part selectors reactive. */
    () => ({
      ...native,
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames(
        `empty-state__${slot}`,
        undefined,
        local.class,
        local.className,
      ),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(name, local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? tag} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Center the Empty State's visual and textual content. */
function EmptyStateContentImpl(props: EmptyStatePartRuntimeProps): JSX.Element {
  return renderEmptyStatePart('EmptyStateContent', 'content', 'div', props);
}

/** Render a caller-supplied icon or visual in the indicator slot. */
function EmptyStateIndicatorImpl(props: EmptyStatePartRuntimeProps): JSX.Element {
  return renderEmptyStatePart('EmptyStateIndicator', 'indicator', 'div', props);
}

/** Render the Empty State heading as a native h3. */
function EmptyStateTitleImpl(props: EmptyStatePartRuntimeProps): JSX.Element {
  return renderEmptyStatePart('EmptyStateTitle', 'title', 'h3', props);
}

/** Render supplementary Empty State text as a native paragraph. */
function EmptyStateDescriptionImpl(props: EmptyStatePartRuntimeProps): JSX.Element {
  return renderEmptyStatePart('EmptyStateDescription', 'description', 'p', props);
}

/** Expose a native content root or caller-selected element. */
export const EmptyStateContent = EmptyStateContentImpl as {
  <As extends NativeElementTag>(props: EmptyStateContentProps<As> & { as: As }): JSX.Element;
  (props: EmptyStateContentProps): JSX.Element;
};

/** Expose a native indicator root or caller-selected element. */
export const EmptyStateIndicator = EmptyStateIndicatorImpl as {
  <As extends NativeElementTag>(props: EmptyStateIndicatorProps<As> & { as: As }): JSX.Element;
  (props: EmptyStateIndicatorProps): JSX.Element;
};

/** Expose a native heading or caller-selected element. */
export const EmptyStateTitle = EmptyStateTitleImpl as {
  <As extends NativeElementTag>(props: EmptyStateTitleProps<As> & { as: As }): JSX.Element;
  (props: EmptyStateTitleProps): JSX.Element;
};

/** Expose a native paragraph or caller-selected element. */
export const EmptyStateDescription = EmptyStateDescriptionImpl as {
  <As extends NativeElementTag>(props: EmptyStateDescriptionProps<As> & { as: As }): JSX.Element;
  (props: EmptyStateDescriptionProps): JSX.Element;
};
