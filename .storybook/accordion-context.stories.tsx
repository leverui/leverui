import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion, Button, Span } from '../src';
import '../demos/examples/accordion.css';

/** Expose the root machine's current expanded values. */
function RootState(): JSX.Element {
  const accordion = Accordion.useAccordionContext();
  return <output data-testid="accordion-root-state">{accordion().value.join(',')}</output>;
}

/** Expose the nearest item's reactive expanded state. */
function ItemState(): JSX.Element {
  const item = Accordion.useAccordionItemContext();
  return (
    <span data-testid="accordion-item-state">{item().expanded ? 'Expanded' : 'Collapsed'}</span>
  );
}

/** Keep a sibling action button outside the disclosure trigger. */
function ActionItem(): JSX.Element {
  const [count, setCount] = createSignal(0);

  /** Count sibling actions without changing disclosure state. */
  function countAction(): void {
    setCount(count() + 1);
  }

  return (
    <Accordion.Item value="actions">
      <div style={{ position: 'relative', padding: '8px 0' }}>
        <Accordion.ItemTrigger
          data-testid="accordion-action-trigger"
          style={{ 'padding-right': '110px' }}
        >
          <Span style={{ flex: '1' }}>Action item</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Button
          type="button"
          variant="subtle"
          size="sm"
          style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}
          onClick={countAction}
        >
          Action
        </Button>
      </div>
      <output data-testid="accordion-action-count">{count()}</output>
      <Accordion.ItemContent>
        <Accordion.ItemBody>Action panel</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Demonstrate root and item context with an expanded-state CSS class. */
function AccordionContextStory(): JSX.Element {
  return (
    <>
      <div style={{ width: '400px', padding: '24px' }}>
        <Accordion.Root collapsible defaultValue={['styled']}>
          <RootState />
          <Accordion.Item value="styled">
            <Accordion.ItemTrigger
              data-testid="accordion-styled-trigger"
              class="accordion-example__context-trigger"
            >
              <Span style={{ flex: '1' }}>Styled item</Span>
              <ItemState />
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>Styled panel</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
          <ActionItem />
        </Accordion.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Accordion Context',
  component: AccordionContextStory,
} satisfies Meta<typeof AccordionContextStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: AccordionContextStory };
