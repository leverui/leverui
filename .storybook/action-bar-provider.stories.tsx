import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ActionBar } from '../src';

/** Exercise inherited primitive positioning beside a caller-owned machine. */
function ActionBarProviderStory(): JSX.Element {
  const machine = ActionBar.useActionBar({
    defaultOpen: true,
    closeOnInteractOutside: false,
    positioning: { placement: 'bottom-end' },
  });

  return (
    <>
      <ActionBar.PropsProvider value={{ positioning: { placement: 'top-start' } }}>
        <ActionBar.Root defaultOpen closeOnInteractOutside={false}>
          <ActionBar.Positioner data-testid="provider-owned-positioner">
            <ActionBar.Content aria-label="Inherited actions" data-testid="provider-owned-content">
              <ActionBar.SelectionTrigger>Owned selection</ActionBar.SelectionTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
        <ActionBar.RootProvider value={machine}>
          <ActionBar.Positioner data-testid="provider-caller-positioner">
            <ActionBar.Content
              aria-label="Caller-owned actions"
              data-testid="provider-caller-content"
            >
              <ActionBar.SelectionTrigger>Caller selection</ActionBar.SelectionTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.RootProvider>
      </ActionBar.PropsProvider>
    </>
  );
}

const meta = {
  title: 'Components/Action Bar Provider',
  component: ActionBarProviderStory,
} satisfies Meta<typeof ActionBarProviderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positioning: Story = { render: ActionBarProviderStory };
