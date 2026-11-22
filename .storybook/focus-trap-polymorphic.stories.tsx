import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FocusTrap } from '../src';

type ActiveTrap = 'section' | 'child' | undefined;

/** Exercise selected HTML tags and a caller-owned child element. */
function FocusTrapPolymorphicExample(): JSX.Element {
  const [active, setActive] = createSignal<ActiveTrap>();

  /** Activate the selected native section. */
  function openSection(): void {
    setActive('section');
  }

  /** Activate the caller-owned article. */
  function openChild(): void {
    setActive('child');
  }

  /** Release the currently active trap. */
  function closeTrap(): void {
    setActive(undefined);
  }

  /** Mark the selected native section delivered to its typed ref. */
  function captureSection(element: HTMLElement): void {
    element.dataset.sectionRef = 'attached';
  }

  /** Mark the caller-owned article delivered to the parent ref. */
  function captureChild(element: Element): void {
    if (element instanceof HTMLElement) element.dataset.childRef = 'attached';
  }

  /** Mark the caller-owned article delivered to its own callback ref. */
  function captureChildOwnedRef(element: HTMLElement): void {
    element.dataset.childOwnedRef = 'attached';
  }

  return (
    <>
      <button type="button" data-testid="focus-trap-section-launcher" onClick={openSection}>
        Start section
      </button>
      <FocusTrap
        as="section"
        disabled={active() !== 'section'}
        ref={captureSection}
        data-testid="focus-trap-section"
      >
        <input aria-label="Section input" data-autofocus />
        <button type="button" onClick={closeTrap}>
          End section
        </button>
      </FocusTrap>
      <button type="button" data-testid="focus-trap-child-launcher" onClick={openChild}>
        Start child
      </button>
      <FocusTrap
        disabled={active() !== 'child'}
        ref={captureChild}
        asChild={
          /** Preserve the caller-owned article while applying parent props. */
          (getProps) => (
            <article {...getProps({ ref: captureChildOwnedRef })} data-testid="focus-trap-child" />
          )
        }
      >
        <input aria-label="Child input" data-autofocus />
        <button type="button" onClick={closeTrap}>
          End child
        </button>
      </FocusTrap>
    </>
  );
}

const meta = {
  title: 'Components/Focus Trap Polymorphic',
  component: FocusTrapPolymorphicExample,
} satisfies Meta<typeof FocusTrapPolymorphicExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
