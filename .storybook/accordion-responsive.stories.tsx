import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion } from '../src';
import '../demos/examples/accordion.css';

/** Keep responsive trigger styling on the same accessible disclosure. */
function ResponsiveAccordionStory(): JSX.Element {
  return (
    <>
      <div style={{ width: 'min(100%, 360px)', padding: '24px' }}>
        <Accordion.Root collapsible>
          <Accordion.Item value="first">
            <Accordion.ItemTrigger
              data-testid="responsive-accordion-trigger"
              class="accordion-example__responsive-trigger"
            >
              Responsive trigger
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>Responsive content</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Accordion Responsive',
  component: ResponsiveAccordionStory,
} satisfies Meta<typeof ResponsiveAccordionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Breakpoint: Story = { render: ResponsiveAccordionStory };
