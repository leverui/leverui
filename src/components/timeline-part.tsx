import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireTimelineRoot } from './timeline-context';
import type { NativeElementTag } from './native-element-props';
import type { TimelinePartRuntimeProps } from './timeline-props';

export type TimelinePartName =
  'item' | 'separator' | 'indicator' | 'connector' | 'content' | 'title' | 'description';

/** Render a selected native event part without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one scoped Timeline part with native attributes and roles. */
export function renderTimelinePart(
  name: string,
  slot: TimelinePartName,
  props: TimelinePartRuntimeProps,
): JSX.Element {
  requireTimelineRoot();
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
    /** Keep content mounted across reactive native attributes. */
    () => local.children,
  );

  /** Forward the selected native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Preserve list-item semantics and stable public part hooks. */
    () => ({
      ...native,
      role: slot === 'item' ? (native.role ?? 'listitem') : native.role,
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames(`timeline__${slot}`, undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(name, local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}
