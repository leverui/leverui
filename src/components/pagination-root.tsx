import { splitProps } from '../primitives/utils/split-props';
import { Pagination as PrimitivePagination } from '../primitives/components/pagination';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { PaginationAppearanceProvider } from './pagination-appearance';
import type { UsePaginationProps, UsePaginationReturn } from './pagination-machine';
import {
  usePaginationRootProps,
  usePaginationRootProviderProps,
  type PaginationRootProps,
  type PaginationRootProviderProps,
} from './pagination-props';

type RuntimeLocalProps = Omit<JSX.IntrinsicElements['nav'], 'ref' | 'value'> & {
  className?: string | undefined;
  unstyled?: boolean | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: NonNullable<PolymorphicProps<'nav'>['asChild']> | undefined;
  children?: JSX.Element | undefined;
};
type RuntimeRootProps = RuntimeLocalProps & UsePaginationProps;
type RuntimeProviderProps = RuntimeLocalProps & { value: UsePaginationReturn };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Forward native props through the primitive while keeping pagination appearance in CSS. */
function renderPaginationRoot(input: RootInput, content: { children?: JSX.Element }): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitivePagination.Root : PrimitivePagination.RootProvider;
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const rootUnstyled = createMemo(
    /** Follow changes to the root's inherited or explicit unstyled choice. */
    () => Boolean(local.unstyled),
  );

  /** Follow the native root selected by the consumer. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'nav';
  }

  /** Give the primitive's child renderer the caller's current ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward machine and native attributes without style-object extraction. */
    () => native,
    {
      /** Keep the callback ref on the default primitive element. */
      get ref() {
        return local.ref;
      },
      /** Expose one stable root hook to consumer CSS. */
      get class() {
        return composeRecipeClassNames('pagination__root', undefined, local.class, local.className);
      },
      /** Suppress the default presentation of every nested part. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Retain children under the primitive's pagination machine. */
      get children() {
        return content.children;
      },
      /** Preserve selected tags and caller-owned child renderers. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'nav'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <PaginationAppearanceProvider value={rootUnstyled}>
      {/* The primitive's two root signatures share this native adapter. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </PaginationAppearanceProvider>
  );
}

/** Render a Pagination root whose state is owned by the primitive. */
function PaginationRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderPaginationRoot({ mode: 'root', props: usePaginationRootProps(instance) }, content);
}

/** Expose a typed native or caller-selected Pagination root. */
export const PaginationRoot = PaginationRootImpl as <As extends PrimitiveNativeTag = 'nav'>(
  props: PaginationRootProps<As>,
) => JSX.Element;

/** Render a Pagination root using a caller-owned primitive machine. */
function PaginationRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderPaginationRoot(
    { mode: 'provider', props: usePaginationRootProviderProps(instance) },
    content,
  );
}

/** Require an external machine for the provider-backed root. */
export const PaginationRootProvider = PaginationRootProviderImpl as <
  As extends PrimitiveNativeTag = 'nav',
>(
  props: PaginationRootProviderProps<As>,
) => JSX.Element;
