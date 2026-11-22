import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { AbsoluteCenter, type AbsoluteCenterProps } from '../src';
import './absolute-center-contract.css';

type GetChildProps = Parameters<NonNullable<AbsoluteCenterProps['asChild']>>[0];

/** Render a native anchor with attributes supplied by its parent. */
function renderOverlayLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps({ class: 'overlay-link' })} href="#layout-target" data-testid="overlay-link">
      Overlay link
    </a>
  );
}

/** Exercise CSS axes, RTL placement, polymorphism, and reactive classes. */
function AbsoluteCenterContractExample(): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Record the native node delivered through the selected-element ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Switch the live axis without replacing the centered element. */
  function toggleAxis(): void {
    setHorizontal(!horizontal());
  }

  return (
    <section class="absolute-center-contract" data-testid="absolute-center-story">
      <div class="center-stage" data-testid="both-parent">
        <AbsoluteCenter class="both-center" data-testid="both-center">
          Both
        </AbsoluteCenter>
      </div>
      <div class="center-stage" data-testid="horizontal-parent">
        <AbsoluteCenter
          axis="horizontal"
          as="section"
          ref={markSection}
          class="horizontal-center"
          data-testid="horizontal-center"
        >
          Horizontal
        </AbsoluteCenter>
      </div>
      <div class="center-stage" data-testid="vertical-parent">
        <AbsoluteCenter axis="vertical" class="vertical-center" data-testid="vertical-center">
          Vertical
        </AbsoluteCenter>
      </div>
      <div class="center-stage" dir="rtl" data-testid="rtl-both-parent">
        <AbsoluteCenter class="both-center" data-testid="rtl-both-center">
          وسط
        </AbsoluteCenter>
      </div>
      <div class="center-stage" dir="rtl" data-testid="rtl-horizontal-parent">
        <AbsoluteCenter
          axis="horizontal"
          class="horizontal-center"
          data-testid="rtl-horizontal-center"
        >
          أفقي
        </AbsoluteCenter>
      </div>
      <div class="center-stage" dir="rtl" data-testid="rtl-vertical-parent">
        <AbsoluteCenter
          axis="vertical"
          class="rtl-vertical-center"
          data-testid="rtl-vertical-center"
        >
          عمودي
        </AbsoluteCenter>
      </div>
      <div class="center-stage" data-testid="overlay-parent">
        <span id="layout-target">Existing content</span>
        <AbsoluteCenter
          asChild={renderOverlayLink}
          class="overlay-center"
          aria-label="Centered overlay link"
        />
      </div>
      <div class="center-stage" data-testid="reactive-parent">
        <AbsoluteCenter
          axis={horizontal() ? 'horizontal' : 'both'}
          class="reactive-center"
          data-testid="reactive-center"
        >
          Reactive
        </AbsoluteCenter>
      </div>
      <button type="button" data-testid="axis-toggle" onClick={toggleAxis}>
        Toggle axis
      </button>
    </section>
  );
}

const meta = {
  title: 'Layout/Absolute Center',
  component: AbsoluteCenterContractExample,
} satisfies Meta<typeof AbsoluteCenterContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
