import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { ButtonGroup, IconButton, Pagination, usePaginationContext } from '../../src';

/** Show ten pages with the default ghost controls. */
export function PaginationBasic(): JSX.Element {
  return (
    <Pagination.Root count={20} pageSize={2} defaultPage={1}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        />
        <Pagination.Items
          render={(page, getProps) => (
            <IconButton
              {...getProps()}
              variant={usePaginationContext()().page === page.value ? 'outline' : 'ghost'}
            >
              {page.value}
            </IconButton>
          )}
        />
        <Pagination.NextTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronRightIcon />
            </IconButton>
          )}
        />
      </ButtonGroup>
    </Pagination.Root>
  );
}

/** Keep the selected page in a Solid signal. */
export function PaginationControlled(): JSX.Element {
  const [page, setPage] = createSignal(1);
  return (
    <Pagination.Root
      count={20}
      pageSize={2}
      page={page()}
      onPageChange={
        /** Apply a newly requested page. */
        (details) => setPage(details.page)
      }
    >
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        />
        <Pagination.Items
          render={(page, getProps) => (
            <IconButton
              {...getProps()}
              variant={usePaginationContext()().page === page.value ? 'outline' : 'ghost'}
            >
              {page.value}
            </IconButton>
          )}
        />
        <Pagination.NextTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronRightIcon />
            </IconButton>
          )}
        />
      </ButtonGroup>
    </Pagination.Root>
  );
}

/** Show two neighbors around the tenth of twenty pages. */
export function PaginationSiblingCount(): JSX.Element {
  return (
    <Pagination.Root count={200} pageSize={10} defaultPage={10} siblingCount={2}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        />
        <Pagination.Items
          render={(page, getProps) => (
            <IconButton
              {...getProps()}
              variant={usePaginationContext()().page === page.value ? 'outline' : 'ghost'}
            >
              {page.value}
            </IconButton>
          )}
        />
        <Pagination.NextTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronRightIcon />
            </IconButton>
          )}
        />
      </ButtonGroup>
    </Pagination.Root>
  );
}
