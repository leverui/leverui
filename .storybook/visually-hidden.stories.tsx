import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { VisuallyHidden, type VisuallyHiddenProps } from '../src';
import './visually-hidden-example.css';

type GetChildProps = Parameters<NonNullable<VisuallyHiddenProps['asChild']>>[0];

/** Render the guide's input example without adding a span around it. */
function renderSearchInput(getProps: GetChildProps): JSX.Element {
  return (
    <input
      {...getProps({ class: 'search-child' })}
      id="hidden-search"
      type="text"
      aria-label="Search messages"
      data-testid="hidden-search"
    />
  );
}

/** Exercise native hidden text, child composition, and reactive CSS. */
function VisuallyHiddenContractExample(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Verify the child path forwards its native input ref. */
  function markInput(element: HTMLElement): void {
    element.dataset.parentRef = element.tagName.toLowerCase();
  }

  /** Change a consumer style without replacing hidden content. */
  function toggleWidth(): void {
    setWide(!wide());
  }

  return (
    <section data-testid="visually-hidden-story">
      <button type="button" data-testid="notification-button">
        3 <VisuallyHidden data-testid="notification-label">Notifications</VisuallyHidden>
      </button>
      <VisuallyHidden asChild={renderSearchInput} ref={markInput} data-parent="hidden-input" />
      <VisuallyHidden
        as="label"
        for="visible-search"
        data-testid="hidden-label"
        class={wide() ? 'hidden-label-wide' : undefined}
      >
        Visible search label
      </VisuallyHidden>
      <input id="visible-search" data-testid="visible-search" />
      <button type="button" data-testid="hidden-width-toggle" onClick={toggleWidth}>
        Change hidden width
      </button>
    </section>
  );
}

const meta = {
  title: 'Utilities/Visually Hidden',
  component: VisuallyHiddenContractExample,
} satisfies Meta<typeof VisuallyHiddenContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
