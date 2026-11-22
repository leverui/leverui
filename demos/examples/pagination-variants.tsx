import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { ButtonGroup, IconButton, Pagination, usePaginationContext } from '../../src';

/** Use an outline group with a solid selected page. */
export function PaginationVariants(): JSX.Element {
  return (
    <Pagination.Root count={20} pageSize={2} defaultPage={1}>
      <ButtonGroup variant="outline" size="sm">
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
              variant={usePaginationContext()().page === page.value ? 'solid' : 'outline'}
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

/** Join outline controls into one attached group. */
export function PaginationAttached(): JSX.Element {
  return (
    <Pagination.Root count={20} pageSize={2} defaultPage={1}>
      <ButtonGroup variant="outline" size="sm" attached>
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
              variant={usePaginationContext()().page === page.value ? 'solid' : 'outline'}
              style={{ 'z-index': usePaginationContext()().page === page.value ? '1' : undefined }}
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
