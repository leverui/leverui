import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, Popover, Portal, Select } from '../../src';

const projects = Select.createListCollection({
  items: [
    { label: 'Website redesign', value: 'website-redesign' },
    { label: 'Mobile app', value: 'mobile-app' },
    { label: 'Data migration', value: 'data-migration' },
    { label: 'Onboarding', value: 'onboarding' },
  ],
});

/** Open a Select from inside a modal dialog. */
export function SelectOpenFromDialog(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Forward dialog activation to its outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger
              asChild={
                /** Retain the close control's native button behavior. */
                (getProps) => <CloseButton {...getProps()} />
              }
            />
            <Dialog.Header>
              <Dialog.Title>Select in dialog</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Select.Root
                collection={projects}
                size="sm"
                positioning={{ sameWidth: true, placement: 'bottom' }}
              >
                <Select.HiddenSelect />
                <Select.Label>Select project</Select.Label>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select project" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    <Select.List>
                      <For each={projects.items}>
                        {(project) => <Select.Item item={project}>{project.label}</Select.Item>}
                      </For>
                    </Select.List>
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Dialog.Body>
            <Dialog.Footer />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

const assignees = Select.createListCollection({
  items: [
    { label: 'Ava Chen', value: 'ava-chen' },
    { label: 'Ben Ortiz', value: 'ben-ortiz' },
    { label: 'Chloe Martin', value: 'chloe-martin' },
    { label: 'Daniel Kim', value: 'daniel-kim' },
  ],
});

/** Open a Select inside a compact Popover. */
export function SelectOpenFromPopover(): JSX.Element {
  return (
    <Popover.Root size="xs">
      <Popover.Trigger
        asChild={
          /** Keep popover activation on the styled outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Select in popover
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>Select in popover</Popover.Header>
            <Popover.Body>
              <Select.Root
                collection={assignees}
                size="sm"
                positioning={{ sameWidth: true, placement: 'bottom' }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select assignee" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content style={{ width: '100%' }}>
                    <Select.List>
                      <For each={assignees.items}>
                        {(assignee) => (
                          <Select.Item item={assignee}>
                            {assignee.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        )}
                      </For>
                    </Select.List>
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
