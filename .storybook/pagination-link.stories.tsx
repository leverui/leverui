import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Pagination } from '../src';

/** Mark the native anchor delivered to a link-mode part ref. */
function markAnchorRef(element: HTMLAnchorElement): void {
  element.dataset.receivedAnchorRef = 'true';
}

/** Render the primitive's link pagination as real anchors with page URLs. */
function LinkPagination(): JSX.Element {
  return (
    <>
      <Pagination.Root
        type="link"
        count={50}
        pageSize={10}
        defaultPage={2}
        getPageUrl={
          /** Map machine page requests to article URLs. */
          ({ page }) => `/articles?page=${page}`
        }
        aria-label="Article pages"
        data-testid="pagination-link-root"
      >
        <Pagination.PrevTrigger ref={markAnchorRef} data-testid="pagination-link-prev">
          Previous
        </Pagination.PrevTrigger>
        <Pagination.Items data-testid="pagination-link-item" />
        <Pagination.Item
          type="page"
          value={5}
          ref={markAnchorRef}
          data-testid="pagination-link-ref-item"
        >
          5
        </Pagination.Item>
        <Pagination.NextTrigger data-testid="pagination-link-next">Next</Pagination.NextTrigger>
      </Pagination.Root>
    </>
  );
}

const meta = {
  title: 'Components/Pagination/Link',
  component: LinkPagination,
} satisfies Meta<typeof LinkPagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Links: Story = {};
