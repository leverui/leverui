import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Text, TextPropsProvider, type TextProps } from '../src';

type GetTextChildProps = Parameters<NonNullable<TextProps['asChild']>>[0];

/** Exercise native typography, context defaults, and reactive CSS values. */
function TextContractExample(): JSX.Element {
  const [active, setActive] = createSignal(false);
  const [eventOrder, setEventOrder] = createSignal('');

  /** Record the props provider's event before the instance event. */
  function recordProviderClick(label: string): void {
    setEventOrder(
      /** Append the provider's bound label to the event trace. */
      (value) => `${value}${label},`,
    );
  }

  /** Record the Text instance's native click event. */
  function recordInstanceClick(): void {
    setEventOrder(
      /** Append the instance event after the provider event. */
      (value) => `${value}instance,`,
    );
  }

  /** Record an instance event supplied through Solid's bound handler form. */
  function recordBoundInstanceClick(label: string): void {
    setEventOrder(
      /** Append the bound instance label after the provider event. */
      (value) => `${value}${label},`,
    );
  }

  /** Mark the actual native paragraph received by Solid's ref. */
  function markParagraph(element: HTMLParagraphElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the native span selected by Text's polymorphic `as` prop. */
  function markSpan(element: HTMLSpanElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Toggle typography without remounting the text nodes. */
  function toggleText(): void {
    setActive(!active());
  }

  /** Render a native link with Text's child attributes and semantics. */
  function renderLink(getProps: GetTextChildProps): JSX.Element {
    return (
      <a {...getProps()} href="#text-target" data-testid="text-link">
        Read more
      </a>
    );
  }

  return (
    <>
      <TextPropsProvider
        value={{
          class: 'provider-text',
          style: {
            color: active() ? 'var(--lui-colors-blue-500)' : 'var(--lui-colors-red-500)',
            'text-decoration': 'underline',
            'letter-spacing': '0.05em',
          },
          onClick: [recordProviderClick, 'provider'],
        }}
      >
        <Text
          ref={markParagraph}
          data-testid="default-text"
          id="text-target"
          class="instance-text"
          style={{
            'text-transform': 'uppercase',
            'font-weight': 'bold',
            'font-size': active() ? 'var(--lui-font-sizes-xl)' : 'var(--lui-font-sizes-sm)',
          }}
          onClick={recordInstanceClick}
        >
          Paragraph text
        </Text>
        <Text
          as="span"
          ref={markSpan}
          data-testid="span-text"
          style={{ color: 'var(--lui-colors-green-500)' }}
        >
          Inline text
        </Text>
        <Text asChild={renderLink} aria-label="Text link" />
        <Text as="button" type="button" onClick={[recordBoundInstanceClick, 'instance-bound']}>
          Bound text event
        </Text>
        <Text truncate style={{ 'max-width': '100px' }} data-testid="truncate-text">
          A very long sentence that should truncate
        </Text>
        <Text
          lineClamp={active() ? 'none' : '2'}
          style={{ 'max-width': '120px' }}
          data-testid="clamp-text"
        >
          A long sentence that should occupy several lines before it is clamped to the chosen count
          of visible lines.
        </Text>
        <Text unstyled style={{ 'letter-spacing': 'normal' }} data-testid="unstyled-text">
          Unstyled text
        </Text>
        <Text style={{ 'letter-spacing': active() ? '0.2em' : '0.1em' }} data-testid="custom-text">
          Consumer styled text
        </Text>
      </TextPropsProvider>
      <output data-testid="text-events">{eventOrder()}</output>
      <button type="button" onClick={toggleText} data-testid="text-toggle">
        Toggle text
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Text',
  component: TextContractExample,
} satisfies Meta<typeof TextContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
