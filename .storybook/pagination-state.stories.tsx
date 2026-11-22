import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Pagination, usePagination, usePaginationContext } from '../src';

/** Show the current page and total count from the primitive's public accessor. */
function PaginationStateOutput(): JSX.Element {
  const pagination = usePaginationContext();
  return <output data-testid="pagination-state">{pagination().page}</output>;
}

/** Prove controlled page state and inherited count stay reactive. */
function ControlledPagination(): JSX.Element {
  const [page, setPage] = createSignal(2);
  const [count, setCount] = createSignal(50);

  /** Apply the primitive page requests to caller-owned state. */
  function updatePage(details: { page: number }): void {
    setPage(details.page);
  }

  /** Change the inherited item count without remounting the root. */
  function shrinkCount(): void {
    setCount(30);
  }

  return (
    <>
      <Pagination.PropsProvider
        value={
          /** Supply the latest item count to the nested root. */
          () => ({ count: count(), pageSize: 10 })
        }
      >
        <Pagination.Root
          page={page()}
          onPageChange={updatePage}
          data-testid="pagination-controlled"
        >
          <Pagination.PrevTrigger data-testid="pagination-controlled-prev">
            Prev
          </Pagination.PrevTrigger>
          <Pagination.Items />
          <Pagination.NextTrigger data-testid="pagination-controlled-next">
            Next
          </Pagination.NextTrigger>
          <PaginationStateOutput />
          <Pagination.PageText data-testid="pagination-controlled-text" />
        </Pagination.Root>
      </Pagination.PropsProvider>
      <button type="button" onClick={shrinkCount} data-testid="pagination-shrink">
        Shrink count
      </button>
    </>
  );
}

/** Drive RootProvider from a caller-owned primitive machine. */
function StorePagination(): JSX.Element {
  const pagination = usePagination({ count: 40, pageSize: 10, defaultPage: 2 });

  /** Advance the external machine without replacing its nav. */
  function nextPage(): void {
    pagination().goToNextPage();
  }

  return (
    <>
      <Pagination.RootProvider value={pagination} data-testid="pagination-store">
        <Pagination.Items />
        <PaginationStateOutput />
      </Pagination.RootProvider>
      <button type="button" onClick={nextPage} data-testid="pagination-store-next">
        Next from store
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Pagination/State',
  component: ControlledPagination,
} satisfies Meta<typeof ControlledPagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = {};
export const Store: Story = { render: StorePagination };
