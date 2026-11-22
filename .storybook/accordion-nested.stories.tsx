import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion } from '../src';

/** Keep an inner machine and CSS appearance inside an expanded outer panel. */
function NestedAccordionStory(): JSX.Element {
  return (
    <>
      <div style={{ width: '360px', padding: '24px' }}>
        <Accordion.Root collapsible defaultValue={['outer']} variant="outline">
          <Accordion.Item value="outer">
            <Accordion.ItemTrigger data-testid="outer-accordion-trigger">
              Outer trigger
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Accordion.Root collapsible defaultValue={['inner']} variant="subtle">
                  <Accordion.Item value="inner">
                    <Accordion.ItemTrigger data-testid="inner-accordion-trigger">
                      Inner trigger
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody>Inner content</Accordion.ItemBody>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Accordion Nested',
  component: NestedAccordionStory,
} satisfies Meta<typeof NestedAccordionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Independent: Story = { render: NestedAccordionStory };
