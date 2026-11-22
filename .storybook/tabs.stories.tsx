import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPropsProvider,
  TabsRoot,
  TabsTrigger,
  type TabsValueChangeDetails,
} from '../src';

/** Exercise controlled state, keyboard modes, disabled tabs, and appearance defaults. */
function TabsContractExample(): JSX.Element {
  const [value, setValue] = createSignal('one');
  const [large, setLarge] = createSignal(false);

  /** Synchronize a primitive selection event with the consumer's Solid signal. */
  function updateValue(details: TabsValueChangeDetails): void {
    if (details.value !== null) setValue(details.value);
  }

  /** Change the inherited size while preserving the selected tab. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Mark the native root delivered to a consumer ref. */
  function markRoot(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the native button delivered to a trigger ref. */
  function markTrigger(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the native panel delivered to a content ref. */
  function markContent(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <div data-testid="tabs-contract">
        <button type="button" data-testid="tabs-size-toggle" onClick={toggleSize}>
          Toggle Tabs size
        </button>
        <TabsPropsProvider value={{ size: large() ? 'lg' : 'sm' }}>
          <TabsRoot
            ref={markRoot}
            value={value()}
            onValueChange={updateValue}
            lazyMount
            unmountOnExit
          >
            <TabsList aria-label="Controlled tabs">
              <TabsTrigger value="one" ref={markTrigger} data-testid="tab-one">
                One
              </TabsTrigger>
              <TabsTrigger value="two" data-testid="tab-two">
                Two
              </TabsTrigger>
              <TabsTrigger value="disabled" disabled data-testid="tab-disabled">
                Disabled
              </TabsTrigger>
              <TabsIndicator data-testid="tabs-indicator" />
            </TabsList>
            <TabsContent value="one" ref={markContent} data-testid="panel-one">
              First panel
            </TabsContent>
            <TabsContent value="two" data-testid="panel-two">
              Second panel
            </TabsContent>
          </TabsRoot>
        </TabsPropsProvider>
        <output data-testid="tabs-value">{value()}</output>
        <TabsRoot defaultValue="alpha" orientation="vertical" activationMode="manual">
          <TabsList aria-label="Manual tabs">
            <TabsTrigger value="alpha" data-testid="manual-alpha">
              Alpha
            </TabsTrigger>
            <TabsTrigger value="beta" data-testid="manual-beta">
              Beta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="alpha" data-testid="manual-panel-alpha">
            Alpha panel
          </TabsContent>
          <TabsContent value="beta" data-testid="manual-panel-beta">
            Beta panel
          </TabsContent>
        </TabsRoot>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tabs',
  component: TabsContractExample,
} satisfies Meta<typeof TabsContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
