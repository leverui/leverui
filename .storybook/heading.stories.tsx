import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Heading, HeadingPropsProvider, type HeadingProps } from '../src';

type GetHeadingChildProps = Parameters<NonNullable<HeadingProps['asChild']>>[0];
const headingSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const;

/** Render heading styles on a consumer-owned, keyboard-focusable link. */
function renderHeadingLink(getProps: GetHeadingChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#heading-target" data-testid="heading-link">
      Read heading details
    </a>
  );
}

/** Exercise semantic elements, CSS sizes, inherited defaults, and live styles. */
function HeadingContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Mark the native heading selected by the consumer. */
  function markH1(element: HTMLHeadingElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change provider defaults and native styles without remounting nodes. */
  function toggleHeading(): void {
    setLarge(!large());
  }

  /** Render one size as a native heading. */
  function renderSize(size: (typeof headingSizes)[number]): JSX.Element {
    return (
      <Heading size={size} data-testid={`heading-size-${size}`}>
        Heading {size}
      </Heading>
    );
  }

  return (
    <>
      <Heading data-testid="heading-default" id="heading-target">
        Default heading
      </Heading>
      <For each={headingSizes}>{renderSize}</For>
      <HeadingPropsProvider
        value={{
          size: large() ? '3xl' : 'sm',
          style: { color: `var(--leverui-colors-${large() ? 'blue' : 'red'}-500)` },
          class: 'provider-heading',
        }}
      >
        <Heading data-testid="heading-inherited">Inherited heading</Heading>
        <Heading
          size="md"
          style={{ color: 'var(--leverui-colors-green-500)' }}
          data-testid="heading-fixed"
        >
          Fixed heading
        </Heading>
        <Heading as="h1" ref={markH1} title="Page title" data-testid="heading-h1">
          Page title
        </Heading>
        <Heading asChild={renderHeadingLink} aria-label="Heading link" />
      </HeadingPropsProvider>
      <Heading unstyled data-testid="heading-unstyled">
        Unstyled heading
      </Heading>
      <Heading style={{ 'font-size': large() ? '40px' : '30px' }} data-testid="heading-local-style">
        Custom style
      </Heading>
      <Heading style={{ 'font-weight': 'normal' }} data-testid="heading-weight">
        Normal weight
      </Heading>
      <Heading class="consumer-heading" data-testid="heading-css-override">
        Consumer stylesheet
      </Heading>
      <button type="button" data-testid="heading-toggle" onClick={toggleHeading}>
        Toggle heading
      </button>
    </>
  );
}

/** Show that application-owned CSS variables customize a heading. */
function HeadingCustomSystemExample(): JSX.Element {
  return (
    <div style="--leverui-fonts-heading: Georgia, serif; --leverui-font-weights-semibold: 400">
      <Heading
        style={{ 'font-size': '2rem', 'line-height': '2.5rem' }}
        data-testid="heading-custom-system"
      >
        Custom system heading
      </Heading>
    </div>
  );
}

const meta = {
  title: 'Content/Heading',
  component: HeadingContractExample,
} satisfies Meta<typeof HeadingContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};

export const CustomSystem: Story = { render: HeadingCustomSystemExample };
