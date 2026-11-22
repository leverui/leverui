import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { ButtonGroup, IconButton, Pagination } from '../../src';

/** Render the compact previous, count, and next controls. */
export function PaginationCompact(): JSX.Element {
  return (
    <Pagination.Root count={20} pageSize={2} defaultPage={1}>
      <ButtonGroup size="sm" variant="ghost" style={{ gap: 'var(--leverui-spacing-4)' }}>
        <Pagination.PrevTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        />
        <Pagination.PageText format="compact" />
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

/** Show the current item range before the navigation buttons. */
export function PaginationCountText(): JSX.Element {
  return (
    <Pagination.Root count={50} pageSize={5} defaultPage={1} style={{ 'max-width': '240px' }}>
      <ButtonGroup size="sm" variant="ghost" style={{ width: '100%' }}>
        <Pagination.PageText format="long" style={{ flex: '1' }} />
        <Pagination.PrevTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronLeftIcon />
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

/** Format the page count in the custom wording. */
export function PaginationCustomFormat(): JSX.Element {
  return (
    <Pagination.Root count={50} pageSize={5} defaultPage={1} style={{ 'max-width': '240px' }}>
      <ButtonGroup size="sm" variant="ghost" style={{ width: '100%' }}>
        <Pagination.PageText
          format={
            /** Format the current page. */
            ({ page, totalPages }) => `Page ${page} de ${totalPages}`
          }
          style={{ flex: '1' }}
        />
        <Pagination.PrevTrigger
          asChild={(getProps) => (
            <IconButton {...getProps()}>
              <ChevronLeftIcon />
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
