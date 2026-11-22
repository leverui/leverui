import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Quote } from '../src';
import '../demos/quote-example.css';

/** Exercise native quotation, selected elements, and changing styles. */
function QuoteContractExample(): JSX.Element {
  const [plain, setPlain] = createSignal(false);
  const [tag, setTag] = createSignal<'q' | 'span'>('q');
  const [clicks, setClicks] = createSignal(0);

  /** Record the actual element delivered to a consumer ref. */
  function markRef(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Switch consumer CSS classes without replacing the quotation element. */
  function toggleStyle(): void {
    setPlain(!plain());
  }

  /** Switch the native tag through a tracked Solid prop. */
  function toggleTag(): void {
    setTag(tag() === 'q' ? 'span' : 'q');
  }

  /** Count native clicks on the selected anchor. */
  function recordClick(): void {
    setClicks(clicks() + 1);
  }

  return (
    <>
      <div style={{ 'font-weight': '400', 'line-height': '30px' }}>
        <Quote
          cite="https://example.com/quotation"
          title="Source quotation"
          ref={markRef}
          data-testid="native-quote"
        >
          A short quotation
        </Quote>
        <Quote class="consumer-quote" data-testid="css-quote">
          Consumer CSS quotation
        </Quote>
        <Quote
          class={plain() ? 'quote-story-reactive quote-story-plain' : 'quote-story-reactive'}
          data-testid="reactive-quote"
        >
          Reactive quotation
        </Quote>
        <Quote unstyled data-testid="unstyled-quote">
          Unstyled quotation
        </Quote>
        <Quote
          as="a"
          href="#quote-target"
          ref={markRef}
          onClick={recordClick}
          data-testid="link-quote"
        >
          Linked quotation
        </Quote>
        <Quote
          asChild={
            /** Put quotation styles on a consumer-owned span. */
            (getProps) => (
              <span {...getProps({})} data-testid="child-quote">
                Child quotation
              </span>
            )
          }
        />
        <Quote as={tag()} ref={markRef} data-testid="tag-quote">
          Selected quotation
        </Quote>
        <button type="button" onClick={toggleStyle} data-testid="quote-style-toggle">
          Toggle quote style
        </button>
        <button type="button" onClick={toggleTag} data-testid="quote-tag-toggle">
          Toggle quote tag
        </button>
        <output data-testid="quote-clicks">{clicks()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Quote',
  component: QuoteContractExample,
} satisfies Meta<typeof QuoteContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
