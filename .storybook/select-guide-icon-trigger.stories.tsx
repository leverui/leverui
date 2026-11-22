import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { IconButton, Portal, Select } from '../src';
import { frameworkIconPaths } from './select-guide-icon-paths.mjs';

type FrameworkIconName = keyof typeof frameworkIconPaths;
type FrameworkName = Exclude<FrameworkIconName, 'none'>;
type Framework = { label: string; value: FrameworkName };

const frameworks: Framework[] = [
  { label: 'React.js', value: 'react' },
  { label: 'SolidJS', value: 'solid' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
];
const collection = Select.createListCollection({ items: frameworks });

/** Draw a decorative framework glyph from local path data. */
function FrameworkIcon(props: { name: FrameworkIconName }): JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d={frameworkIconPaths[props.name]} />
    </svg>
  );
}

/** Render a caller-owned square IconButton with Select's trigger behavior. */
function IconTrigger(): JSX.Element {
  const select = Select.useSelectContext();

  /** Follow the machine's current value without a second selection signal. */
  function selectedIcon(): FrameworkIconName {
    return (
      frameworks.find(
        /** Match the selected collection value to its visible glyph. */
        (item) => item.value === select().value[0],
      )?.value ?? 'none'
    );
  }

  return (
    <IconButton
      {...select().getTriggerProps()}
      aria-label="Select framework"
      variant="outline"
      size="sm"
      style={{ 'padding-inline': 'var(--leverui-spacing-2)' }}
      data-testid="icon-select-trigger"
    >
      <FrameworkIcon name={selectedIcon()} />
    </IconButton>
  );
}

/** Compose an icon-only button with Select options and native form output. */
function IconSelectGuide(): JSX.Element {
  return (
    <>
      <form data-testid="icon-select-form" style={{ padding: '24px' }}>
        <Select.Root
          collection={collection}
          name="framework"
          size="sm"
          defaultValue={['react']}
          positioning={{ sameWidth: false }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <IconTrigger />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content style={{ 'min-width': 'var(--leverui-sizes-32)' }}>
                <Select.List>
                  <For each={frameworks}>
                    {
                      /** Keep each glyph and readable name in one option. */
                      (item) => (
                        <Select.Item item={item}>
                          <FrameworkIcon name={item.value} />
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      )
                    }
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide Icon Trigger',
  component: IconSelectGuide,
} satisfies Meta<typeof IconSelectGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: IconSelectGuide };
