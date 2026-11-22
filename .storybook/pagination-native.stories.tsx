import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Pagination } from '../src';

/** Mark the caller-owned navigation element received through the primitive. */
function markRoot(element: Element): void {
  element.setAttribute('data-received-root-ref', 'true');
}

/** Mark the caller-owned page text element received through Solid. */
function markPageText(element: Element): void {
  element.setAttribute('data-received-text-ref', 'true');
}

/** Exercise caller-owned elements and unstyled defaults without a provider. */
function NativePagination(): JSX.Element {
  return (
    <Pagination.Root
      count={100}
      pageSize={10}
      defaultPage={1}
      unstyled
      ref={markRoot}
      asChild={
        /** Keep the primitive's navigation attributes on the supplied native element. */
        (getProps) => <nav {...getProps()} data-testid="pagination-native-root" />
      }
    >
      <Pagination.Items />
      <Pagination.PageText
        ref={markPageText}
        asChild={
          /** Keep the reactive page text on the supplied native element. */
          (getProps) => <span {...getProps()} data-testid="pagination-native-text" />
        }
      />
    </Pagination.Root>
  );
}

const meta = {
  title: 'Components/Pagination/Native',
  component: NativePagination,
} satisfies Meta<typeof NativePagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Unstyled: Story = {};
