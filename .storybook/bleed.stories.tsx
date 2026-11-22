import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Bleed, type BleedProps } from '../src';

type GetChildProps = Parameters<NonNullable<BleedProps['asChild']>>[0];

/** Render a native link with the bleed styles and attributes supplied by its parent. */
function renderBleedLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#bleed-target" data-testid="bleed-link">
      Bleeding link
    </a>
  );
}

/** Exercise spacing tokens, logical edges, responsive values, refs, and styles. */
function BleedContractExample(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Record the native section delivered through the component ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change one spacing value without remounting its native element. */
  function toggleSpacing(): void {
    setWide(!wide());
  }

  return (
    <section data-testid="bleed-story">
      <div style={{ width: '240px', padding: '40px' }} data-testid="inline-parent">
        <Bleed inline="10" style={{ height: '40px' }} data-testid="inline-bleed">
          Inline
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '40px' }} data-testid="block-parent">
        <Bleed block="10" style={{ height: '40px' }} data-testid="block-bleed">
          Block
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} data-testid="start-parent">
        <Bleed inlineStart="8" blockStart="8" style={{ height: '40px' }} data-testid="start-bleed">
          Start
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} data-testid="end-parent">
        <Bleed inlineEnd="8" blockEnd="8" style={{ height: '40px' }} data-testid="end-bleed">
          End
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} dir="rtl" data-testid="rtl-parent">
        <Bleed inlineStart="8" style={{ height: '40px' }} data-testid="rtl-bleed">
          RTL start
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} dir="rtl" data-testid="rtl-end-parent">
        <Bleed inlineEnd="8" style={{ height: '40px' }} data-testid="rtl-end-bleed">
          RTL end
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} data-testid="precedence-parent">
        <Bleed
          inline="4"
          inlineStart="8"
          block="4"
          blockStart="8"
          style={{ height: '40px' }}
          data-testid="precedence-bleed"
        >
          Axis precedence
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} data-testid="responsive-parent">
        <Bleed
          inline={{ base: '2', md: '6' }}
          block={['2', null, '6']}
          style={{ height: '40px' }}
          data-testid="responsive-bleed"
        >
          Responsive
        </Bleed>
      </div>
      <div
        style={{ width: '240px', padding: '32px', '--custom-gap': '18px' }}
        data-testid="raw-parent"
      >
        <Bleed
          inlineStart="12px"
          blockEnd="var(--custom-gap)"
          style={{ height: '40px' }}
          data-testid="raw-bleed"
        >
          Raw spacing
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} data-testid="reactive-parent">
        <Bleed
          as="section"
          ref={markSection}
          inline={wide() ? '6' : '2'}
          class="consumer-bleed"
          style={{ height: '40px' }}
          aria-label="Reactive bleed"
          data-testid="reactive-bleed"
        >
          Reactive
        </Bleed>
      </div>
      <div style={{ width: '240px', padding: '32px' }} data-testid="link-parent">
        <Bleed asChild={renderBleedLink} inline="8" aria-label="Bleeding link" />
      </div>
      <Bleed
        inline="4"
        style={{ position: 'fixed', top: '0', left: '0', width: '1px', height: '1px' }}
        data-testid="native-style-bleed"
      />
      <span id="bleed-target">Link target</span>
      <button type="button" onClick={toggleSpacing} data-testid="bleed-toggle">
        Change bleed
      </button>
    </section>
  );
}

const meta = {
  title: 'Layout/Bleed',
  component: BleedContractExample,
} satisfies Meta<typeof BleedContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
