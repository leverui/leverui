import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Em, Text } from '../src';
import './em-contract.css';

/** Show native emphasis, selected elements, and live consumer style overrides. */
function EmContractExample(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Mark the native element received through Solid's ref. */
  function markEm(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the selected strong element without changing its semantics. */
  function markStrong(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change consumer styles while keeping the emphasis node mounted. */
  function toggleStyle(): void {
    setPlain(!plain());
  }

  return (
    <>
      <Text>
        The{' '}
        <Em ref={markEm} title="Emphasis" data-testid="native-em">
          design system
        </Em>{' '}
        is a collection of UI elements.
      </Text>
      <Em class="em-story-normal" data-testid="css-override-em">
        Consumer CSS override
      </Em>
      <Em
        data-testid="reactive-em"
        class={plain() ? 'em-story-reactive em-story-plain' : 'em-story-reactive'}
      >
        Reactive emphasis
      </Em>
      <Em as="strong" ref={markStrong} data-testid="strong-em">
        Selected native element
      </Em>
      <Em unstyled data-testid="unstyled-em">
        Plain emphasis
      </Em>
      <Em as="span" unstyled data-testid="unstyled-span-em">
        Plain span
      </Em>
      <Em
        asChild={
          /** Forward native attributes and the stable class to a consumer-owned link. */
          (getProps) => (
            <a {...getProps()} href="#em-target" data-testid="child-em">
              Emphasized link
            </a>
          )
        }
      />
      <button type="button" onClick={toggleStyle} data-testid="em-toggle">
        Toggle emphasis style
      </button>
    </>
  );
}

const meta = {
  title: 'Content/Em',
  component: EmContractExample,
} satisfies Meta<typeof EmContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
