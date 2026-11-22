import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { skeletonVariantAttributes } from './skeleton-attributes';
import { readSkeletonVariant } from './skeleton-choices';
import { useSkeletonProps, type SkeletonProps, type SkeletonRootProps } from './skeleton-props';

type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a selected intrinsic tag without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a reactive placeholder with finite state hooks for authored CSS. */
export function SkeletonRoot(props: SkeletonRootProps): JSX.Element {
  const merged = useSkeletonProps(props);
  const [local, native] = splitProps(merged, [
    'as',
    'asChild',
    'children',
    'ref',
    'class',
    'loading',
    'variant',
    'unstyled',
  ]);

  /** Forward the mounted placeholder to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep provider defaults, state, and native attributes live. */
    () => ({
      ...native,
      ...skeletonVariantAttributes(readSkeletonVariant(local.variant)),
      'data-loading': (local.loading ?? true) ? '' : undefined,
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('skeleton', undefined, local.class),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          'Skeleton',
          local.asChild,
          attributes,
          /** Preserve caller content while its loading state changes. */
          () => local.children,
        )
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Bind selected native tags and caller-owned children to Skeleton props. */
export const Skeleton = SkeletonRoot as <As extends IntrinsicElement = 'div'>(
  props: SkeletonProps<As>,
) => JSX.Element;
