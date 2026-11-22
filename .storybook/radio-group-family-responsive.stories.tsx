import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioGroup } from '../src';
import { RadioGroupFamilyChoice } from './radio-group-family-choice';
import './radio-group-responsive.css';

/** Keep one machine mounted while CSS layout and ARIA orientation change. */
function ResponsiveGroup(): JSX.Element {
  const [orientation, setOrientation] = createSignal<'horizontal' | 'vertical'>('horizontal');

  /** Subscribe to the same viewport breakpoint used by the story layout. */
  function connectBreakpoint(): (() => void) | undefined {
    const query = window.matchMedia('(min-width: 48rem)');
    setOrientation(query.matches ? 'vertical' : 'horizontal');

    /** Follow media-query changes without replacing the primitive's root. */
    function updateOrientation(event: MediaQueryListEvent): void {
      setOrientation(event.matches ? 'vertical' : 'horizontal');
    }

    query.addEventListener('change', updateOrientation);
    /** Remove the listener when Storybook unmounts the example. */
    return () => query.removeEventListener('change', updateOrientation);
  }

  onSettled(connectBreakpoint);

  return (
    <>
      <RadioGroup.Root
        name="transport"
        defaultValue="train"
        colorPalette="blue"
        class="radio-group-responsive"
        size={{ base: 'xs', md: 'lg' }}
        orientation={orientation()}
        variant={orientation() === 'horizontal' ? 'outline' : 'solid'}
        data-testid="radio-group-responsive"
      >
        <RadioGroup.Label>Transport</RadioGroup.Label>
        <RadioGroupFamilyChoice value="train" label="Train" />
        <RadioGroupFamilyChoice value="bus" label="Bus" />
      </RadioGroup.Root>
    </>
  );
}

const meta = {
  title: 'Components/Radio Group Family Responsive',
  component: ResponsiveGroup,
} satisfies Meta<typeof ResponsiveGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Responsive: Story = { render: ResponsiveGroup };
