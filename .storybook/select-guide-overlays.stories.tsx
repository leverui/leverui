import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Dialog, Popover, Portal, Select } from '../src';

const frameworks = Select.createListCollection({
  items: [
    { label: 'React.js', value: 'react' },
    { label: 'SolidJS', value: 'solid' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ],
});

/** Keep Select's positioner inside its parent overlay's focus boundary. */
function OverlaySelect(props: { kind: 'dialog' | 'popover' }): JSX.Element {
  return (
    <form data-testid={`select-${props.kind}-form`}>
      <Select.Root
        collection={frameworks}
        name="framework"
        size="sm"
        positioning={{ sameWidth: true, placement: 'bottom' }}
      >
        <Select.HiddenSelect />
        <Select.Label>Select framework</Select.Label>
        <Select.Control>
          <Select.Trigger data-testid={`select-${props.kind}-trigger`}>
            <Select.ValueText placeholder="Select framework" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner data-testid={`select-${props.kind}-positioner`}>
          <Select.Content style={{ width: '100%' }}>
            <Select.List data-testid={`select-${props.kind}-listbox`}>
              <For each={frameworks.items}>
                {
                  /** Bind each overlay option to its collection item. */
                  (item) => (
                    <Select.Item item={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  )
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </form>
  );
}

/** Exercise Select inside Dialog and Popover without a nested body portal. */
function OverlayGuide(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', gap: '24px', padding: '32px' }}>
        <Dialog.Root>
          <Dialog.Trigger data-testid="select-dialog-open">Select in Dialog</Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content data-testid="select-dialog-content">
                <Dialog.Title>Select in Dialog</Dialog.Title>
                <Dialog.Body>
                  <OverlaySelect kind="dialog" />
                </Dialog.Body>
                <Dialog.CloseTrigger data-testid="select-dialog-close">Close</Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        <Popover.Root size="xs">
          <Popover.Trigger data-testid="select-popover-open">Select in Popover</Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content data-testid="select-popover-content">
                <Popover.Header>
                  <Popover.Title>Select in Popover</Popover.Title>
                </Popover.Header>
                <Popover.Body>
                  <OverlaySelect kind="popover" />
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide Overlays',
  component: OverlayGuide,
} satisfies Meta<typeof OverlayGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: OverlayGuide };
