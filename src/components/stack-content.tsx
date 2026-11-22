import { For, Show, children, createComponent, createMemo, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { recipeClassName } from '../styled-system/recipe-class';
import { collectStackItems, type StackItem } from './stack-items';

/** Specialize Solid's generic For component for stable Stack items. */
const StackFor = For as (props: {
  each: readonly StackItem[];
  children: (item: StackItem, index: Accessor<number>) => JSX.Element;
}) => JSX.Element;

// A type alias, unlike an interface, is assignable to JSX props with `data-*` index signatures.
export type StackSeparatorRenderProps = {
  class: string;
};

/** Create one separator for each gap under Solid's keyed ownership. */
export type StackSeparatorRenderer = (props: StackSeparatorRenderProps) => JSX.Element;

export interface StackContentProps {
  children?: JSX.Element | undefined;
  renderChildren?: (() => JSX.Element) | undefined;
  separator?: StackSeparatorRenderer | undefined;
}

/** Own visible children and stable separator nodes independently of rendering. */
export function createStackContent(props: StackContentProps): () => JSX.Element {
  const content = children(
    /** Resolve visible Solid children under Stack's reactive owner. */
    () => props.renderChildren?.() ?? props.children,
  );
  const cache = new WeakMap<object, StackItem>();
  const items = createMemo(
    /** Preserve stable child groups across reactive list changes. */
    () => collectStackItems(content.toArray(), cache),
  );
  let separatedContent: JSX.Element | undefined;

  /** Reuse the keyed separator tree while its child list changes. */
  function stackContent(): JSX.Element {
    if (!props.separator) return content();
    if (separatedContent !== undefined) return separatedContent;
    separatedContent = createComponent(StackFor, {
      /** Follow visible child changes without rebuilding the keyed tree. */
      get each() {
        return items();
      },
      /** Keep each item and its following separator in one keyed scope. */
      children: (item, index) => (
        <>
          {item.content}
          <Show when={index() < items().length - 1 ? props.separator : undefined}>
            {/** Apply the authored separator class to each renderer. */}
            {(renderer) =>
              createComponent(renderer(), { class: recipeClassName('stack-separator') })
            }
          </Show>
        </>
      ),
    });
    return separatedContent;
  }

  return stackContent;
}
