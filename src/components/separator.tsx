import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { separatorAttributes } from './separator-attributes';
import { readSeparatorChoices } from './separator-choices';
import { useSeparatorProps, type SeparatorProps, type SeparatorRootProps } from './separator-props';

type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a selected intrinsic element without a style runtime. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Use instance-owned semantic orientation. */
function semanticOrientation(
  orientation: SeparatorRootProps['orientation'],
): 'horizontal' | 'vertical' | undefined {
  if (orientation === undefined || orientation === 'horizontal') return 'horizontal';
  if (orientation === 'vertical') return 'vertical';
  return undefined;
}

/** Render separator semantics and finite CSS hooks on a native element. */
function SeparatorRoot(props: SeparatorRootProps): JSX.Element {
  const merged = useSeparatorProps(props);
  const [local, native] = splitProps(merged, [
    'children',
    'as',
    'asChild',
    'ref',
    'size',
    'variant',
    'orientation',
    'unstyled',
    'class',
  ]);

  /** Forward the mounted element to the selected-tag or child callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep provider choices, native attributes, and state hooks reactive. */
    () => {
      const semantic = semanticOrientation(props.orientation);
      const role: JSX.HTMLAttributes<HTMLElement>['role'] = semantic ? 'separator' : 'presentation';
      return {
        role,
        'aria-orientation': semantic,
        ...native,
        ...separatorAttributes(readSeparatorChoices(local)),
        'data-unstyled': local.unstyled ? '' : undefined,
        class: composeRecipeClassNames('separator', undefined, local.class),
        ref: attachNode,
      };
    },
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          'Separator',
          local.asChild,
          attributes,
          /** Preserve caller-owned content on its selected element. */
          () => local.children,
        )
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native tags, refs, and caller-owned children to Separator props. */
export const Separator = SeparatorRoot as <As extends IntrinsicElement = 'span'>(
  props: SeparatorProps<As>,
) => JSX.Element;
