import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioCard } from '../src';

/** Follow a browser breakpoint with one radio machine orientation. */
function RadioCardResponsiveExample(): JSX.Element {
  const [vertical, setVertical] = createSignal(false);

  /** Attach a responsive orientation signal after the story mounts. */
  function connectBreakpoint(): (() => void) | undefined {
    const query = window.matchMedia('(min-width: 48rem)');
    setVertical(query.matches);

    /** Keep the machine and CSS orientation in sync as the viewport changes. */
    function handleChange(event: MediaQueryListEvent): void {
      setVertical(event.matches);
    }

    query.addEventListener('change', handleChange);
    /** Release the query listener with the story's owner. */
    return () => query.removeEventListener('change', handleChange);
  }

  onSettled(connectBreakpoint);

  return (
    <>
      <RadioCard.Root
        name="responsive-framework"
        defaultValue="solid"
        size={{ base: 'sm', md: 'lg' }}
        variant={{ base: 'outline', md: 'solid' }}
        orientation={vertical() ? 'vertical' : 'horizontal'}
        data-testid="responsive-radio-card-root"
      >
        <RadioCard.Label>Responsive framework</RadioCard.Label>
        <RadioCard.Item value="solid">
          <RadioCard.ItemHiddenInput />
          <RadioCard.ItemControl data-testid="responsive-radio-card-control">
            <RadioCard.ItemText>Solid</RadioCard.ItemText>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemControl>
        </RadioCard.Item>
      </RadioCard.Root>
    </>
  );
}

const meta = {
  title: 'Components/Radio Card Responsive',
  component: RadioCardResponsiveExample,
} satisfies Meta<typeof RadioCardResponsiveExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
