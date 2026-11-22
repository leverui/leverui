import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Field, Heading, Input, Tabs, Text, type TabsValueChangeDetails } from '../../src';

/** Keep tab selection in a caller-owned Solid signal. */
export function TabsControlled(): JSX.Element {
  const [value, setValue] = createSignal<string | null>('first');

  /** Synchronize the selected tab with the state change. */
  function updateValue(details: TabsValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <Tabs.Root value={value()} onValueChange={updateValue}>
      <Tabs.List>
        <Tabs.Trigger value="first">First tab</Tabs.Trigger>
        <Tabs.Trigger value="second">Second tab</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">First panel</Tabs.Content>
      <Tabs.Content value="second">Second panel</Tabs.Content>
    </Tabs.Root>
  );
}

/** Keep each nested tab set independent of its parent. */
export function TabsNested(): JSX.Element {
  return (
    <Tabs.Root
      defaultValue="one"
      aria-label="Custom tabs"
      style={{ 'max-width': 'var(--leverui-sizes-xl)' }}
    >
      <Tabs.List>
        <Tabs.Trigger value="one">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="two">Tab 2</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">
        <Text
          textStyle="md"
          style={{
            'margin-bottom': 'var(--leverui-spacing-6)',
            'margin-top': 'var(--leverui-spacing-4)',
          }}
        >
          This tab has its own set of tabs.
        </Text>
        <Tabs.Root variant="subtle" defaultValue="one">
          <Tabs.List>
            <Tabs.Trigger value="one">Tab 1.1</Tabs.Trigger>
            <Tabs.Trigger value="two">Tab 1.2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="one" style={{ 'padding-block': 'var(--leverui-spacing-4)' }}>
            <Field.Root>
              <Field.Label>Tab 1.1</Field.Label>
              <Input />
            </Field.Root>
          </Tabs.Content>
          <Tabs.Content value="two" style={{ 'padding-block': 'var(--leverui-spacing-4)' }}>
            <Field.Root>
              <Field.Label>Tab 1.2</Field.Label>
              <Input />
            </Field.Root>
          </Tabs.Content>
        </Tabs.Root>
      </Tabs.Content>
      <Tabs.Content value="two">
        <Heading
          style={{
            'margin-bottom': 'var(--leverui-spacing-6)',
            'margin-top': 'var(--leverui-spacing-4)',
          }}
        >
          This is a normal tab
        </Heading>
        <Text>It holds plain content and no other tabs.</Text>
      </Tabs.Content>
    </Tabs.Root>
  );
}

/** Match the equal-width enclosed triggers. */
export function TabsFitted(): JSX.Element {
  return (
    <Tabs.Root
      variant="enclosed"
      fitted
      defaultValue="tab-1"
      style={{ 'max-width': 'var(--leverui-sizes-md)' }}
    >
      <Tabs.List>
        <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab-3">Tab 3</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}

/** Render tab triggers as links to page fragments. */
export function TabsLinks(): JSX.Element {
  return (
    <Tabs.Root defaultValue="members">
      <Tabs.List>
        <Tabs.Trigger
          value="members"
          asChild={
            /** Forward tab activation to the fragment link. */
            (getProps) => (
              <a {...getProps()} href="#members">
                Members
              </a>
            )
          }
        />
        <Tabs.Trigger
          value="projects"
          asChild={
            /** Forward tab activation to the fragment link. */
            (getProps) => (
              <a {...getProps()} href="#projects">
                Projects
              </a>
            )
          }
        />
      </Tabs.List>
      <Tabs.Content value="members">Invite people and choose their roles.</Tabs.Content>
      <Tabs.Content value="projects">See each project and who is working on it.</Tabs.Content>
    </Tabs.Root>
  );
}
