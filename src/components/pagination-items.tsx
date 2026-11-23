import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createMemo, For, Show, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button } from './button';
import { usePaginationUnstyled } from './pagination-appearance';
import { PaginationEllipsisIcon } from './pagination-ellipsis-icon';
import { usePaginationContext } from './pagination-machine';
import { PaginationEllipsis, PaginationItem } from './pagination-parts';

export interface PaginationPageItem {
  type: 'page';
  value: number;
}

type ItemChildProps = Parameters<NonNullable<PolymorphicProps<'button'>['asChild']>>[0];
type EllipsisChildProps = Parameters<NonNullable<PolymorphicProps<'div'>['asChild']>>[0];

export interface PaginationItemsProps extends Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'children' | 'ref' | 'as' | 'asChild'
> {
  /** Render each page through a caller-owned Solid element. */
  render?: ((page: PaginationPageItem, getProps: ItemChildProps) => JSX.Element) | undefined;
  /** Render each machine-computed gap through a caller-owned Solid element. */
  ellipsis?: ((getProps: EllipsisChildProps) => JSX.Element) | undefined;
}

/** Render every machine-computed page and ellipsis in order. */
export function PaginationItems(props: PaginationItemsProps): JSX.Element {
  const [local, native] = splitProps(props, ['render', 'ellipsis']);
  const pagination = usePaginationContext();
  const rootUnstyled = usePaginationUnstyled();

  /** Key pages by number so machine updates retain a focused page element. */
  function readPageKeys(): Array<number | string> {
    return pagination().pages.map(
      /** Give each noninteractive gap a distinct position-based key. */
      (page, index) => (page.type === 'page' ? page.value : `ellipsis-${index}`),
    );
  }

  const pageKeys = createMemo(readPageKeys);

  /** Render a gap with caller content or the default three-dot button. */
  function renderEllipsis(index: Accessor<number>): JSX.Element {
    return (
      <Show
        keyed
        when={local.ellipsis}
        fallback={
          <PaginationEllipsis
            index={index()}
            {...native}
            asChild={
              /** Put the primitive's ellipsis attributes on the native Button path. */
              (getProps) => (
                <Button
                  as="span"
                  unstyled={rootUnstyled()}
                  {...getProps({ class: 'lui-pagination__ellipsis-button' })}
                >
                  <PaginationEllipsisIcon />
                </Button>
              )
            }
          />
        }
      >
        {
          /** Replace gap markup when the caller changes its renderer. */
          (render) => <PaginationEllipsis index={index()} {...native} asChild={render} />
        }
      </Show>
    );
  }

  /** Render a page through caller-owned markup or a native primitive item. */
  function renderPage(page: PaginationPageItem): JSX.Element {
    return (
      <Show
        keyed
        when={local.render}
        fallback={
          <PaginationItem type="page" value={page.value} {...native}>
            {page.value}
          </PaginationItem>
        }
      >
        {
          /** Replace page markup when the caller changes its renderer. */
          (render) => (
            <PaginationItem
              type="page"
              value={page.value}
              {...native}
              asChild={
                /** Merge the primitive page behavior into the caller's Solid element. */
                (getProps) => render(page, getProps)
              }
            />
          )
        }
      </Show>
    );
  }

  return (
    <For each={pageKeys()}>
      {
        /** Retain each numeric page node while the primitive changes the visible range. */
        (key, index) => (
          <>
            {typeof key === 'number'
              ? renderPage({ type: 'page', value: key })
              : renderEllipsis(index)}
          </>
        )
      }
    </For>
  );
}
