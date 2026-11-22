import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SegmentGroup, type SegmentGroupItemProps } from '../src';

/** Put the primitive item props on a caller-owned noninteractive container. */
const renderItemDiv: NonNullable<SegmentGroupItemProps['asChild']> = (getProps) => (
  <div {...getProps()} />
);

/** Exercise the public generated items and moving indicator in a browser. */
function SegmentGroupContractExample(): JSX.Element {
  const [value, setValue] = createSignal('React');
  const [large, setLarge] = createSignal(false);

  /** Keep the selected value controlled by a Solid signal. */
  function handleValueChange(details: { value: string | null }): void {
    setValue(details.value ?? 'React');
  }

  /** Change the CSS size without replacing the machine. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <form style={{ width: '440px', padding: '24px' }} data-testid="segment-group-form">
        <SegmentGroup.Root
          name="framework"
          aria-label="Framework"
          value={value()}
          onValueChange={handleValueChange}
          size={large() ? 'lg' : 'sm'}
          data-testid="segment-group-root"
        >
          <SegmentGroup.Indicator data-testid="segment-group-indicator" />
          <SegmentGroup.Items
            items={['React', 'Solid', { value: 'Vue', label: 'Vue', disabled: true }]}
          />
        </SegmentGroup.Root>
        <output data-testid="segment-group-selected">{value()}</output>
        <button type="button" onClick={toggleSize} data-testid="toggle-segment-group-size">
          Toggle size
        </button>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Segment Group',
  component: SegmentGroupContractExample,
} satisfies Meta<typeof SegmentGroupContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};

/** Exercise a polymorphic item surface with native radio activation. */
function SegmentGroupPolymorphicExample(): JSX.Element {
  return (
    <>
      <form data-testid="segment-polymorphic-form">
        <SegmentGroup.Root name="framework" aria-label="Polymorphic" defaultValue="React">
          <SegmentGroup.Indicator />
          <SegmentGroup.Items as="div" items={['React', 'Solid']} />
        </SegmentGroup.Root>
        <SegmentGroup.Root name="direct" aria-label="Direct item" defaultValue="React">
          <SegmentGroup.Item as="div" value="React">
            <SegmentGroup.ItemText>React</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
          <SegmentGroup.Item as="div" value="Solid">
            <SegmentGroup.ItemText>Solid</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
        <SegmentGroup.Root name="child" aria-label="Child item" defaultValue="React">
          <SegmentGroup.Item value="React" asChild={renderItemDiv}>
            <SegmentGroup.ItemText>React</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
          <SegmentGroup.Item value="Solid" asChild={renderItemDiv}>
            <SegmentGroup.ItemText>Solid</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </form>
    </>
  );
}

/** Exercise root disabled, readonly, and vertical keyboard paths. */
function SegmentGroupStatesExample(): JSX.Element {
  return (
    <>
      <form data-testid="segment-states-form">
        <SegmentGroup.Root name="disabled" aria-label="Disabled" defaultValue="React" disabled>
          <SegmentGroup.Items items={['React', 'Solid']} />
        </SegmentGroup.Root>
        <SegmentGroup.Root name="readonly" aria-label="Readonly" defaultValue="React" readOnly>
          <SegmentGroup.Items items={['React', 'Solid']} />
        </SegmentGroup.Root>
        <SegmentGroup.Root
          name="vertical"
          aria-label="Vertical"
          defaultValue="React"
          orientation="vertical"
        >
          <SegmentGroup.Items items={['React', 'Solid']} />
        </SegmentGroup.Root>
      </form>
    </>
  );
}

export const Polymorphic: Story = { render: SegmentGroupPolymorphicExample };
export const States: Story = { render: SegmentGroupStatesExample };

/** Show provider-free CSS variables beside an unstyled native radio group. */
function SegmentGroupCssExample(): JSX.Element {
  return (
    <div>
      <SegmentGroup.Root
        name="consumer"
        aria-label="Consumer styles"
        class="consumer-segment"
        defaultValue="React"
        data-testid="segment-css-root"
      >
        <SegmentGroup.Indicator data-testid="segment-css-indicator" />
        <SegmentGroup.Items items={['React', 'Solid']} />
      </SegmentGroup.Root>
      <SegmentGroup.Root
        name="unstyled"
        aria-label="Unstyled group"
        defaultValue="React"
        unstyled
        data-testid="segment-unstyled-root"
      >
        <SegmentGroup.Indicator data-testid="segment-unstyled-indicator" />
        <SegmentGroup.Items items={['React', 'Solid']} />
      </SegmentGroup.Root>
    </div>
  );
}

export const CssContract: Story = { render: SegmentGroupCssExample };
