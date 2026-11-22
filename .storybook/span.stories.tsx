import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Span } from '../src';
import './span-example.css';

/** Exercise inline text, native selection, child rendering, and live classes. */
function SpanContractExample(): JSX.Element {
  const [alternate, setAlternate] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);

  /** Mark the element delivered to a consumer ref. */
  function markRef(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the consumer class without replacing the span node. */
  function toggleColor(): void {
    setAlternate(!alternate());
  }

  /** Record native anchor clicks. */
  function recordClick(): void {
    setClicks(clicks() + 1);
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '12px', width: '320px' }}>
        <p data-testid="span-inline-line">
          Before{' '}
          <Span ref={markRef} title="Inline segment" data-testid="span-default">
            inline
          </Span>{' '}
          after
        </p>
        <Span class="span-story-styled" data-testid="span-styled">
          Styled segment
        </Span>
        <Span class="consumer-span span-story-red" data-testid="span-consumer-css">
          Consumer override
        </Span>
        <Span
          class={alternate() ? 'span-story-blue' : 'span-story-red'}
          data-testid="span-reactive"
        >
          Reactive segment
        </Span>
        <Span
          as="a"
          href="#span-target"
          ref={markRef}
          onClick={recordClick}
          data-testid="span-selected"
        >
          Selected anchor
        </Span>
        <Span
          asChild={
            /** Apply native attributes to the consumer-owned link. */
            (getProps) => (
              <a {...getProps({})} data-testid="span-child" href="#span-child-target">
                Child-owned anchor
              </a>
            )
          }
        />
        <button type="button" onClick={toggleColor} data-testid="span-color-toggle">
          Toggle color
        </button>
        <output data-testid="span-clicks">{clicks()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Span',
  component: SpanContractExample,
} satisfies Meta<typeof SpanContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
