import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { Button, ButtonGroup, Pagination, usePaginationContext } from '../../src';

/** Link to the adjacent page using the current pagination context. */
function PaginationArrowLink(props: { direction: 'left' | 'right' }): JSX.Element {
  const pagination = usePaginationContext();
  return (
    <Button
      as="a"
      href={`?page=${props.direction === 'left' ? pagination().previousPage : pagination().nextPage}`}
      style={{ padding: '0' }}
    >
      {props.direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </Button>
  );
}

/** Render the pagination controls as real page links. */
export function PaginationAsLink(): JSX.Element {
  return (
    <Pagination.Root
      type="link"
      count={20}
      pageSize={2}
      defaultPage={1}
      getPageUrl={
        /** Put the destination page in the current URL query. */
        ({ page }) => `?page=${page}`
      }
    >
      <ButtonGroup variant="ghost" size="sm">
        <PaginationArrowLink direction="left" />
        <Pagination.Items
          render={
            /** Keep each machine-generated page as a styled anchor. */
            (page, getProps) => (
              <Button
                as="a"
                {...getProps()}
                style={{ padding: '0' }}
                variant={usePaginationContext()().page === page.value ? 'outline' : 'ghost'}
              >
                {page.value}
              </Button>
            )
          }
        />
        <PaginationArrowLink direction="right" />
      </ButtonGroup>
    </Pagination.Root>
  );
}
