import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion } from '../src';

const variants = ['outline', 'subtle', 'enclosed', 'plain'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

/** Show each CSS variant at one consistent size. */
function VariantMatrix(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '24px', width: '360px', padding: '24px' }}>
        <For each={variants}>
          {
            /** Keep each variant's disclosure content comparable. */
            (variant) => (
              <section data-testid={`accordion-variant-${variant}`}>
                <Accordion.Root variant={variant} defaultValue={['first']}>
                  <Accordion.Item value="first">
                    <Accordion.ItemTrigger>
                      {variant} trigger
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody>{variant} content</Accordion.ItemBody>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>
              </section>
            )
          }
        </For>
      </div>
    </>
  );
}

/** Show all three trigger and padding sizes. */
function SizeMatrix(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '24px', width: '360px', padding: '24px' }}>
        <For each={sizes}>
          {
            /** Keep an open item available for each size. */
            (size) => (
              <section data-testid={`accordion-size-${size}`}>
                <Accordion.Root size={size} defaultValue={['first']}>
                  <Accordion.Item value="first">
                    <Accordion.ItemTrigger>
                      {size} trigger
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody>{size} content</Accordion.ItemBody>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>
              </section>
            )
          }
        </For>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Accordion Variants',
  component: VariantMatrix,
} satisfies Meta<typeof VariantMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = { render: VariantMatrix };
export const Sizes: Story = { render: SizeMatrix };
