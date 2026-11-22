import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { dataListAttributes } from './data-list-attributes';
import { readDataListChoices } from './data-list-choices';
import { DataListContextProvider } from './data-list-context';
import type { NativeElementTag } from './native-element-props';
import {
  useDataListProps,
  type DataListRootProps,
  type DataListRootRuntimeProps,
} from './data-list-props';

/** Render a selected native description list without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a semantic description list with authored, responsive choices. */
function DataListRootComponent(props: DataListRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useDataListProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'orientation',
    'variant',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const choices = createMemo(
    /** Validate the finite choices before reflecting them in public attributes. */
    () => readDataListChoices(local),
  );

  /** Forward the chosen native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and responsive selectors reactive. */
    () => ({
      ...native,
      ...dataListAttributes(choices()),
      class: composeRecipeClassNames('data-list__root', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  /** Resolve descendants under this list's semantic part context. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Preserve the native content across responsive choice updates. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('DataListRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'dl'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(DataListContextProvider, {
    value: true,
    /** Mount the native list while its part context is active. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native description-list attributes and caller-owned children. */
export const DataListRoot = DataListRootComponent as <As extends NativeElementTag = 'dl'>(
  props: DataListRootProps<As>,
) => JSX.Element;
