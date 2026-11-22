import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion, Span, type AccordionValueChangeDetails } from '../src';

const items = [
  { value: 'first', title: 'First item', body: 'First panel content' },
  { value: 'second', title: 'Second item', body: 'Second panel content' },
  { value: 'third', title: 'Third item', body: 'Third panel content' },
] as const;

/** Render one accessible disclosure item through the public parts. */
function AccordionStoryItem(props: {
  value: string;
  title: string;
  body: string;
  disabled?: boolean;
}): JSX.Element {
  return (
    <Accordion.Item value={props.value} disabled={props.disabled}>
      <Accordion.ItemTrigger>
        <Span style={{ flex: '1' }}>{props.title}</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>{props.body}</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Exercise the default appearance, disabled item, and lazy disclosure behavior. */
function AccordionContractStory(): JSX.Element {
  return (
    <>
      <div style={{ width: '360px', padding: '24px' }}>
        <Accordion.Root collapsible defaultValue={['second']} lazyMount>
          <AccordionStoryItem {...items[0]} />
          <AccordionStoryItem {...items[1]} />
          <AccordionStoryItem {...items[2]} disabled />
        </Accordion.Root>
      </div>
    </>
  );
}

/** Verify external values, multiple expansion, and root-state context. */
function AccordionControlledStory(): JSX.Element {
  const [value, setValue] = createSignal<string[]>(['first']);

  /** Open the second item through an external controlled update. */
  function openSecond(): void {
    setValue(['second']);
  }

  /** Follow value changes emitted by the machine-owned root. */
  function followValueChange(details: AccordionValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <>
      <div style={{ width: '360px', padding: '24px' }}>
        <button type="button" onClick={openSecond}>
          Open second externally
        </button>
        <output data-testid="accordion-values">{value().join(',')}</output>
        <Accordion.Root value={value()} onValueChange={followValueChange} multiple>
          <For each={items}>
            {
              /** Keep each item bound to its machine value. */
              (item) => <AccordionStoryItem {...item} />
            }
          </For>
        </Accordion.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Accordion',
  component: AccordionContractStory,
} satisfies Meta<typeof AccordionContractStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: AccordionContractStory };
export const Controlled: Story = { render: AccordionControlledStory };
