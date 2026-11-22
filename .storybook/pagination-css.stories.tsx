import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Pagination } from '../src';

/** Prove an ordinary consumer stylesheet can override a public color token. */
function CssPagination(): JSX.Element {
  return (
    <>
      <style>{`.pagination-css { --leverui-colors-blue-500: rgb(13, 97, 142); color: var(--leverui-colors-blue-500); }`}</style>
      <Pagination.Root
        class="pagination-css"
        count={30}
        pageSize={10}
        data-testid="pagination-css-root"
      >
        <Pagination.Items />
        <Pagination.PageText />
      </Pagination.Root>
    </>
  );
}

const meta = {
  title: 'Components/Pagination/CSS',
  component: CssPagination,
} satisfies Meta<typeof CssPagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Override: Story = {};
