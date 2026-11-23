import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { tagAttributes } from './tag-attributes';
import { readTagChoices, readTagPalette } from './tag-choices';
import { TagContextProvider } from './tag-context';
import type { NativeElementTag } from './native-element-props';
import { useTagProps, type TagRootProps, type TagRootRuntimeProps } from './tag-props';

/** Render a selected native element without injecting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an inline Tag with authored size, treatment, and palette selectors. */
function TagRootComponent(props: TagRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useTagProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const selected = createMemo(
    /** Validate finite choices before reflecting them in public attributes. */
    () => readTagChoices(local.size, local.variant),
  );

  /** Forward the selected native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props, palette, and responsive choices reactive. */
    () => ({
      ...native,
      ...tagAttributes(selected()),
      'data-lui-color-palette': readTagPalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('tag__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Resolve parts inside this root's semantic scope. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Keep native children mounted across variant changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('TagRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(TagContextProvider, {
    value: true,
    /** Mount the native root while its parts can access the context. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native Tag attributes and caller-owned child rendering. */
export const TagRoot = TagRootComponent as <As extends NativeElementTag = 'div'>(
  props: TagRootProps<As>,
) => JSX.Element;
