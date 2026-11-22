import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Tabs,
  TabsContent,
  TabsContentGroup,
  TabsList,
  TabsPropsProvider,
  TabsRootProvider,
  TabsTrigger,
  useTabs,
} from '../src';

/** Display a caller-owned Tabs machine with authored CSS and native composition. */
function TabsFamilyExample(): JSX.Element {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const tabs = useTabs({ defaultValue: 'first' });

  /** Toggle inherited appearance without resetting selection. */
  function toggleSize(): void {
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  /** Expose the selected machine value from the primitive's current state. */
  function selectedValue(): string {
    return tabs().value ?? '';
  }

  return (
    <>
      <div data-testid="tabs-family">
        <button type="button" data-testid="tabs-family-size" onClick={toggleSize}>
          Toggle size
        </button>
        <TabsPropsProvider value={() => ({ size: size(), fitted: true, variant: 'enclosed' })}>
          <TabsRootProvider value={tabs} data-testid="tabs-family-root">
            <TabsList aria-label="Family tabs" data-testid="tabs-family-list">
              <TabsTrigger value="first" as="a" href="#first" data-testid="tabs-family-first">
                First
              </TabsTrigger>
              <Tabs.Trigger value="second" data-testid="tabs-family-second">
                Second
              </Tabs.Trigger>
            </TabsList>
            <TabsContentGroup data-testid="tabs-family-group">
              <TabsContent value="first" data-testid="tabs-family-panel-first">
                First panel
              </TabsContent>
              <TabsContent value="second" data-testid="tabs-family-panel-second">
                Second panel
              </TabsContent>
            </TabsContentGroup>
          </TabsRootProvider>
        </TabsPropsProvider>
        <output data-testid="tabs-family-value">{selectedValue()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tabs Family',
  component: TabsFamilyExample,
} satisfies Meta<typeof TabsFamilyExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
