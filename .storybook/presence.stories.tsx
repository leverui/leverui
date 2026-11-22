import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Presence, type PresenceProps } from '../src';
import { PresenceControls } from './presence-controls';
import './presence-contract.css';

type GetPresenceProps = Parameters<NonNullable<PresenceProps['asChild']>>[0];

/** Exercise animation styles, native props, and both mounting strategies. */
function PresenceContractExample(): JSX.Element {
  const [present, setPresent] = createSignal(false);
  const [lazyPresent, setLazyPresent] = createSignal(false);
  const [exitPresent, setExitPresent] = createSignal(false);
  const [childPresent, setChildPresent] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);
  const [exits, setExits] = createSignal(0);
  const [childExits, setChildExits] = createSignal(0);

  /** Toggle the four animation examples together. */
  function togglePresent(): void {
    setPresent(!present());
  }

  /** Toggle the initially absent lazy content. */
  function toggleLazy(): void {
    setLazyPresent(!lazyPresent());
  }

  /** Toggle the content that leaves the DOM after its exit animation. */
  function toggleExit(): void {
    setExitPresent(!exitPresent());
  }

  /** Toggle the Presence node rendered through a child element. */
  function toggleChild(): void {
    setChildPresent(!childPresent());
  }

  /** Record child events across entry and exit transitions. */
  function countClick(): void {
    setClicks((current) => current + 1);
  }

  /** Record completion of a Zag-managed exit. */
  function recordExit(): void {
    setExits((current) => current + 1);
  }

  /** Record completion of the child element's exit animation. */
  function recordChildExit(): void {
    setChildExits((current) => current + 1);
  }

  /** Confirm a polymorphic native section reaches the consumer ref. */
  function markFade(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Confirm Presence forwards its own ref to the child element. */
  function markParentChild(element: HTMLElement): void {
    element.dataset.parentRefTag = element.tagName.toLowerCase();
  }

  /** Confirm the child's ref receives the same native element. */
  function markChild(element: HTMLElement): void {
    element.dataset.childRefTag = element.tagName.toLowerCase();
  }

  /** Render Presence through a child section with its own ref. */
  function renderChild(getProps: GetPresenceProps): JSX.Element {
    return (
      <section {...getProps({ ref: markChild })} data-testid="presence-child-element">
        Child presence
      </section>
    );
  }

  return (
    <div data-testid="presence-story">
      <PresenceControls
        present={present}
        lazyPresent={lazyPresent}
        exitPresent={exitPresent}
        childPresent={childPresent}
        togglePresent={togglePresent}
        toggleLazy={toggleLazy}
        toggleExit={toggleExit}
        toggleChild={toggleChild}
      />
      <output data-testid="presence-exit-count">{exits()}</output>
      <output data-testid="presence-child-exit-count">{childExits()}</output>
      <Presence
        class="presence-contract-initial"
        data-testid="presence-initial"
        present
        skipAnimationOnMount
      >
        Initially present
      </Presence>
      <Presence
        as="section"
        class="presence-contract-motion presence-contract-fade presence-contract-padding"
        aria-label="Fade example"
        data-testid="presence-fade"
        ref={markFade}
        present={present()}
      >
        <button type="button" data-testid="presence-child" onClick={countClick}>
          Clicks: {clicks()}
        </button>
      </Presence>
      <Presence
        class="presence-contract-motion presence-contract-scale"
        data-testid="presence-scale"
        present={present()}
      >
        Scale fade
      </Presence>
      <Presence
        class="presence-contract-motion presence-contract-slide-fade"
        data-testid="presence-slide-fade"
        present={present()}
      >
        Slide fade
      </Presence>
      <Presence
        class="presence-contract-motion presence-contract-slide"
        data-testid="presence-slide"
        present={present()}
      >
        Slide
      </Presence>
      <Presence
        class="presence-contract-motion presence-contract-fade"
        data-testid="presence-lazy"
        present={lazyPresent()}
        lazyMount
      >
        Lazy content
      </Presence>
      <Presence
        class="presence-contract-motion presence-contract-fade"
        data-testid="presence-exit"
        present={exitPresent()}
        unmountOnExit
        onExitComplete={recordExit}
      >
        Exit content
      </Presence>
      <Presence
        asChild={renderChild}
        class="presence-contract-motion presence-contract-fade presence-contract-padding"
        ref={markParentChild}
        present={childPresent()}
        lazyMount
        unmountOnExit
        onExitComplete={recordChildExit}
      />
    </div>
  );
}

const meta = {
  title: 'Utilities/Presence',
  component: PresenceContractExample,
} satisfies Meta<typeof PresenceContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
