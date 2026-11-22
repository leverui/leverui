import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { requireStatusRoot } from './status-context';
import type { StatusIndicatorProps, StatusIndicatorRuntimeProps } from './status-props';

/** Render a selected native indicator without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an indicator with native attributes and the public part hook. */
function StatusIndicatorComponent(props: StatusIndicatorRuntimeProps): JSX.Element {
  requireStatusRoot();
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
    /** Preserve caller content across native attribute updates. */
    () => local.children,
  );

  /** Forward the selected indicator node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and part selectors reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('status__indicator', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('StatusIndicator', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native indicator attributes and caller-owned child rendering. */
export const StatusIndicator = StatusIndicatorComponent as <As extends NativeElementTag = 'div'>(
  props: StatusIndicatorProps<As>,
) => JSX.Element;
