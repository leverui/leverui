import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { timelineAttributes } from './timeline-attributes';
import { readTimelineChoices, readTimelinePalette } from './timeline-choices';
import { TimelineContextProvider } from './timeline-context';
import type { NativeElementTag } from './native-element-props';
import {
  useTimelineProps,
  type TimelineRootProps,
  type TimelineRootRuntimeProps,
} from './timeline-props';

/** Render a selected native list element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a Timeline list with authored responsive marker choices. */
function TimelineRootComponent(props: TimelineRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useTimelineProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'variant',
    'showLastSeparator',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const choices = createMemo(
    /** Validate finite choices before exposing them as native attributes. */
    () => readTimelineChoices(local),
  );

  /** Forward the selected list node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, roles, and CSS selectors reactive. */
    () => ({
      ...native,
      ...timelineAttributes(choices()),
      role: native.role ?? 'list',
      'data-lui-color-palette': readTimelinePalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('timeline__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Mount event parts inside their nearest list context. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Preserve event nodes across size and variant changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('TimelineRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(TimelineContextProvider, {
    value: true,
    /** Resolve event parts after their root context exists. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native list attributes and caller-owned child rendering. */
export const TimelineRoot = TimelineRootComponent as <As extends NativeElementTag = 'div'>(
  props: TimelineRootProps<As>,
) => JSX.Element;
