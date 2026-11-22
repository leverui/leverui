import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Pagination, type PaginationItemsProps } from '../src';

/** Render the first caller-owned page format with the primitive's attributes. */
const renderPageA: NonNullable<PaginationItemsProps['render']> = (page, getProps) => (
  <button {...getProps()} data-testid={`pagination-reactive-page-${page.value}`}>
    First {page.value}
  </button>
);

/** Render a replacement page format without changing the machine range. */
const renderPageB: NonNullable<PaginationItemsProps['render']> = (page, getProps) => (
  <button {...getProps()} data-testid={`pagination-reactive-page-${page.value}`}>
    Second {page.value}
  </button>
);

/** Render the first caller-owned gap on its native span. */
const renderGapA: NonNullable<PaginationItemsProps['ellipsis']> = (getProps) => (
  <span {...getProps()} data-testid="pagination-reactive-gap">
    First gap
  </span>
);

/** Render the replacement gap on the same primitive part. */
const renderGapB: NonNullable<PaginationItemsProps['ellipsis']> = (getProps) => (
  <span {...getProps()} data-testid="pagination-reactive-gap">
    Second gap
  </span>
);

/** Change callback presence and identity without remounting Pagination.Root. */
function ReactivePagination(): JSX.Element {
  const [mode, setMode] = createSignal(0);

  /** Cycle between native, first custom, and replacement custom markup. */
  function advanceMode(): void {
    setMode((mode() + 1) % 3);
  }

  return (
    <>
      <button type="button" onClick={advanceMode} data-testid="pagination-reactive-toggle">
        Change renderer
      </button>
      <Pagination.Root
        count={100}
        pageSize={10}
        defaultPage={5}
        data-testid="pagination-reactive-root"
      >
        <Pagination.Items
          render={mode() === 1 ? renderPageA : mode() === 2 ? renderPageB : undefined}
          ellipsis={mode() === 1 ? renderGapA : mode() === 2 ? renderGapB : undefined}
        />
        <Pagination.PageText data-testid="pagination-reactive-text" />
      </Pagination.Root>
    </>
  );
}

const meta = {
  title: 'Components/Pagination/Reactive',
  component: ReactivePagination,
} satisfies Meta<typeof ReactivePagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Callbacks: Story = {};
