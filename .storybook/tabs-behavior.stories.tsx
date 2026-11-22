import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  TabsContent,
  TabsContentGroup,
  TabsList,
  TabsRoot,
  TabsTrigger,
  type TabsValueChangeDetails,
} from '../src';

/** Exercise forwarded primitive options and changing Solid tab collections. */
function TabsBehaviorExample(): JSX.Element {
  const [orientation, setOrientation] = createSignal<'horizontal' | 'vertical'>('horizontal');
  const [thirdVisible, setThirdVisible] = createSignal(false);
  const [selected, setSelected] = createSignal('first');

  /** Change keyboard direction without replacing the Tabs root. */
  function toggleOrientation(): void {
    setOrientation(orientation() === 'horizontal' ? 'vertical' : 'horizontal');
  }

  /** Add a third trigger and select it through controlled state. */
  function addThird(): void {
    setThirdVisible(true);
    setSelected('third');
  }

  /** Remove the selected dynamic trigger and return to a valid value. */
  function removeThird(): void {
    setThirdVisible(false);
    setSelected('first');
  }

  /** Keep dynamic Tabs selection in the consumer's signal. */
  function updateSelected(details: TabsValueChangeDetails): void {
    if (details.value !== null) setSelected(details.value);
  }

  return (
    <>
      <div data-testid="tabs-behavior">
        <button type="button" data-testid="toggle-orientation" onClick={toggleOrientation}>
          Toggle orientation
        </button>
        <TabsRoot
          defaultValue="first"
          loopFocus={false}
          deselectable
          orientation={orientation()}
          data-testid="behavior-root"
        >
          <TabsList aria-label="Behavior tabs">
            <TabsTrigger as="a" href="#tabs-first" value="first" data-testid="behavior-first">
              First
            </TabsTrigger>
            <TabsTrigger value="second" data-testid="behavior-second">
              Second
            </TabsTrigger>
          </TabsList>
          <TabsContent value="first" data-testid="behavior-panel-first">
            First panel
          </TabsContent>
          <TabsContent value="second" data-testid="behavior-panel-second">
            Second panel
          </TabsContent>
        </TabsRoot>
        <button type="button" data-testid="add-third" onClick={addThird}>
          Add third
        </button>
        <button type="button" data-testid="remove-third" onClick={removeThird}>
          Remove third
        </button>
        <TabsRoot value={selected()} onValueChange={updateSelected}>
          <TabsList aria-label="Dynamic tabs">
            <TabsTrigger value="first" data-testid="dynamic-first">
              First
            </TabsTrigger>
            <TabsTrigger value="second" data-testid="dynamic-second">
              Second
            </TabsTrigger>
            <Show when={thirdVisible()}>
              <TabsTrigger value="third" data-testid="dynamic-third">
                Third
              </TabsTrigger>
            </Show>
          </TabsList>
          <TabsContentGroup>
            <TabsContent value="first">First dynamic panel</TabsContent>
            <TabsContent value="second">Second dynamic panel</TabsContent>
            <Show when={thirdVisible()}>
              <TabsContent value="third" data-testid="dynamic-panel-third">
                Third dynamic panel
              </TabsContent>
            </Show>
          </TabsContentGroup>
        </TabsRoot>
        <output data-testid="dynamic-value">{selected()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tabs Behavior',
  component: TabsBehaviorExample,
} satisfies Meta<typeof TabsBehaviorExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
