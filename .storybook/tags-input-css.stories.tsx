import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TagsInput } from '../src';

const sizes = {
  base: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xs',
  '2xl': 'lg',
} as const;
const variants = {
  base: 'outline',
  sm: 'subtle',
  md: 'flushed',
  lg: 'outline',
  xl: 'subtle',
  '2xl': 'flushed',
} as const;

/** Expose every responsive size and variant through one primitive machine. */
function ResponsiveCase(): JSX.Element {
  return (
    <TagsInput.Root
      size={sizes}
      variant={variants}
      colorPalette="blue"
      defaultValue={['Solid']}
      data-testid="tags-css-responsive"
    >
      <TagsInput.Label>Responsive tags</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add a tag" />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Keep appearance props reactive without recreating the native control. */
function ReactiveCase(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the finite CSS selections on the same primitive root. */
  function toggleAppearance(): void {
    setLarge(!large());
  }

  return (
    <>
      <button data-testid="tags-css-toggle" onClick={toggleAppearance}>
        Change appearance
      </button>
      <TagsInput.Root
        size={large() ? 'lg' : 'sm'}
        variant={large() ? 'subtle' : 'outline'}
        defaultValue={['Solid']}
        data-testid="tags-css-reactive"
      >
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Reactive tag" />
        </TagsInput.Control>
      </TagsInput.Root>
    </>
  );
}

/** Show unstyled composition beside the standard CSS path. */
function UnstyledCase(): JSX.Element {
  return (
    <TagsInput.Root unstyled defaultValue={['Solid']} data-testid="tags-css-unstyled">
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Unstyled tag" />
      </TagsInput.Control>
    </TagsInput.Root>
  );
}

/** Put the static and reactive cases under the same theme scope. */
function TagsInputCssContract(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '24px', padding: '24px' }}>
        <ResponsiveCase />
        <ReactiveCase />
        <UnstyledCase />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Tags Input CSS',
  component: TagsInputCssContract,
} satisfies Meta<typeof TagsInputCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: TagsInputCssContract };
