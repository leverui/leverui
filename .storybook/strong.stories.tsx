import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Strong } from '../src';
import './strong-contract.css';

/** Show native importance, selected elements, and reactive style overrides. */
function StrongContractExample(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Mark the element delivered to the public ref. */
  function markRef(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change consumer styling without replacing the Strong element. */
  function toggleStyle(): void {
    setPlain(!plain());
  }

  return (
    <>
      <p data-testid="strong-inline-row">
        Before{' '}
        <Strong ref={markRef} title="Important text" data-testid="strong-native">
          important
        </Strong>{' '}
        after
      </p>
      <Strong class="strong-story-normal" data-testid="strong-css-override">
        Consumer CSS override
      </Strong>
      <div class="strong-hook-scope">
        <Strong data-testid="strong-class-override">Stylesheet override</Strong>
      </div>
      <Strong
        class={plain() ? 'strong-story-reactive strong-story-plain' : 'strong-story-reactive'}
        data-testid="strong-reactive"
      >
        Reactive importance
      </Strong>
      <Strong as="a" href="#strong-target" ref={markRef} data-testid="strong-selected">
        Selected link
      </Strong>
      <Strong
        asChild={
          /** Style a consumer-owned native link. */
          (getProps) => (
            <a {...getProps()} href="#strong-child-target" data-testid="strong-child">
              Child-owned link
            </a>
          )
        }
      />
      <Strong unstyled data-testid="strong-unstyled">
        Unstyled importance
      </Strong>
      <button type="button" onClick={toggleStyle} data-testid="strong-toggle">
        Toggle style
      </button>
    </>
  );
}

const meta = {
  title: 'Content/Strong',
  component: StrongContractExample,
} satisfies Meta<typeof StrongContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
