import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { EmptyState, EmptyStatePropsProvider, Theme } from '../src';
import './empty-state.css';

/** Display sizes, a custom visual, actions, and a changing provider default. */
function EmptyStateContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the inherited CSS size without replacing its root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Supply the current shared Empty State size. */
  function readSizeDefaults(): { size: 'sm' | 'lg' } {
    return { size: large() ? 'lg' : 'sm' };
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '16px', width: '440px' }}>
        <EmptyState.Root data-testid="empty-default">
          <EmptyState.Content data-testid="empty-default-content">
            <EmptyState.Indicator data-testid="empty-default-indicator">
              <span aria-hidden="true">◎</span>
            </EmptyState.Indicator>
            <EmptyState.Title data-testid="empty-default-title">No results</EmptyState.Title>
            <EmptyState.Description data-testid="empty-default-description">
              Try another search.
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
        <EmptyState.Root size="sm" data-testid="empty-sm" role="status">
          <EmptyState.Content>
            <EmptyState.Title>Nothing saved</EmptyState.Title>
          </EmptyState.Content>
        </EmptyState.Root>
        <EmptyState.Root size="lg" data-testid="empty-lg">
          <EmptyState.Content>
            <EmptyState.Indicator>◇</EmptyState.Indicator>
            <EmptyState.Title>Start a collection</EmptyState.Title>
            <EmptyState.Description>Add your first item.</EmptyState.Description>
            <button type="button" data-testid="empty-action">
              Add item
            </button>
          </EmptyState.Content>
        </EmptyState.Root>
        <EmptyState.Root class="empty-state-contract-override" data-testid="empty-css-override">
          <EmptyState.Content>
            <EmptyState.Title>Custom spacing</EmptyState.Title>
          </EmptyState.Content>
        </EmptyState.Root>
        <EmptyState.Root unstyled data-testid="empty-unstyled">
          <EmptyState.Content>
            <EmptyState.Title>Unstyled</EmptyState.Title>
          </EmptyState.Content>
        </EmptyState.Root>
        <EmptyState.Root
          size={{ base: 'sm', md: 'lg', lg: 'sm', xl: 'md', '2xl': 'lg' }}
          data-testid="empty-responsive"
        >
          <EmptyState.Content>
            <EmptyState.Title>Responsive</EmptyState.Title>
          </EmptyState.Content>
        </EmptyState.Root>
        <Theme appearance="dark" hasBackground={false}>
          <EmptyState.Root data-testid="empty-dark">
            <EmptyState.Content>
              <EmptyState.Title>Dark scope</EmptyState.Title>
            </EmptyState.Content>
          </EmptyState.Root>
        </Theme>
        <EmptyStatePropsProvider value={readSizeDefaults}>
          <EmptyState.Root data-testid="empty-reactive">
            <EmptyState.Content>
              <EmptyState.Indicator>◎</EmptyState.Indicator>
              <EmptyState.Title>Live size</EmptyState.Title>
            </EmptyState.Content>
          </EmptyState.Root>
        </EmptyStatePropsProvider>
        <button type="button" onClick={toggleSize} data-testid="empty-toggle">
          Toggle size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Feedback/Empty State',
  component: EmptyStateContractExample,
} satisfies Meta<typeof EmptyStateContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
