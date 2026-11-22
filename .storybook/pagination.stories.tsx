import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Pagination } from '../src';

/** Mark the selected span received through PageText's polymorphic ref. */
function markPageTextSpan(element: HTMLSpanElement): void {
  element.dataset.receivedSpanRef = 'true';
}

/** Exercise the default page list, triggers, and three text formats. */
function BasicPagination(): JSX.Element {
  return (
    <Pagination.Root
      count={100}
      pageSize={10}
      defaultPage={1}
      aria-label="Article pages"
      data-testid="pagination-root"
    >
      <Pagination.PrevTrigger data-testid="pagination-prev">Previous</Pagination.PrevTrigger>
      <Pagination.Items data-testid="pagination-entry" />
      <Pagination.NextTrigger data-testid="pagination-next">Next</Pagination.NextTrigger>
      <Pagination.PageText data-testid="pagination-compact" />
      <Pagination.PageText
        as="span"
        ref={markPageTextSpan}
        format="short"
        data-testid="pagination-short"
      />
      <Pagination.PageText format="long" data-testid="pagination-long" />
    </Pagination.Root>
  );
}

/** Prove Solid child callbacks receive the primitive's behavior and native attributes. */
function CustomPagination(): JSX.Element {
  return (
    <Pagination.Root count={100} pageSize={10} defaultPage={5} data-testid="pagination-custom">
      <Pagination.Items
        render={
          /** Put machine attributes on each caller-owned page button. */
          (page, getProps) => (
            <button {...getProps()} data-testid={`pagination-custom-${page.value}`}>
              Page {page.value}
            </button>
          )
        }
        ellipsis={
          /** Put machine attributes on the caller-owned gap element. */
          (getProps) => (
            <span {...getProps()} data-testid="pagination-custom-gap">
              more
            </span>
          )
        }
      />
      <Pagination.PageText
        format={
          /** Show a localized count through the public formatter details. */
          ({ page, totalPages }) => `Página ${page} de ${totalPages}`
        }
        data-testid="pagination-custom-text"
      />
    </Pagination.Root>
  );
}

const meta = {
  title: 'Components/Pagination',
  component: BasicPagination,
} satisfies Meta<typeof BasicPagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
export const Custom: Story = { render: CustomPagination };
