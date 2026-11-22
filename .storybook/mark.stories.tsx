import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Mark, MarkPropsProvider, type MarkProps } from '../src';
import './mark-contract.css';

type GetMarkChildProps = Parameters<NonNullable<MarkProps['asChild']>>[0];
const variants = ['subtle', 'solid', 'text', 'plain'] as const;

/** Render Mark styles on a consumer-owned keyboard-focusable link. */
function renderMarkLink(getProps: GetMarkChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#mark-target" data-testid="mark-child-link">
      Child link
    </a>
  );
}

/** Exercise native Mark variants, provider defaults, composition, and live CSS. */
function MarkContractExample(): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Record the native anchor selected by a polymorphic Mark. */
  function markAnchor(element: HTMLAnchorElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change provider defaults and a native style without replacing nodes. */
  function toggleMark(): void {
    setChanged(!changed());
  }

  /** Render each documented variant on its native mark element. */
  function renderVariant(variant: (typeof variants)[number]): JSX.Element {
    return (
      <p>
        The{' '}
        <Mark variant={variant} colorPalette="blue" data-testid={`mark-${variant}`}>
          design system
        </Mark>{' '}
        uses the {variant} appearance.
      </p>
    );
  }

  return (
    <>
      <p id="mark-target">
        The <Mark data-testid="mark-default">design system</Mark> is reusable.
      </p>
      <For each={variants}>{renderVariant}</For>
      <MarkPropsProvider
        value={{
          variant: changed() ? 'text' : 'solid',
          colorPalette: 'blue',
          class: 'provider-mark',
          title: 'Shared mark',
        }}
      >
        <Mark data-testid="mark-inherited">Inherited mark</Mark>
        <Mark variant="plain" class="instance-mark" data-testid="mark-fixed">
          Fixed mark
        </Mark>
        <Mark as="a" href="#mark-target" ref={markAnchor} data-testid="mark-anchor">
          Native link
        </Mark>
        <Mark asChild={renderMarkLink} aria-label="Child link label" />
      </MarkPropsProvider>
      <MarkPropsProvider value={{ as: 'strong', title: 'Provider element' }}>
        <Mark data-testid="mark-provider-as">Shared element</Mark>
        <Mark as="mark" data-testid="mark-provider-as-override">
          Local mark
        </Mark>
      </MarkPropsProvider>
      <Mark variant="solid" colorPalette="blue" class="mark-local-override" data-testid="mark-css">
        Local styles
      </Mark>
      <Mark
        variant={{ base: 'subtle', md: 'solid' }}
        colorPalette="blue"
        data-testid="mark-responsive"
      >
        Responsive mark
      </Mark>
      <Mark unstyled data-testid="mark-unstyled">
        Unstyled mark
      </Mark>
      <Mark style={{ 'letter-spacing': changed() ? '2px' : '1px' }} data-testid="mark-style">
        Local style
      </Mark>
      <Mark class="consumer-mark" data-testid="mark-consumer-css">
        Consumer stylesheet
      </Mark>
      <button type="button" data-testid="mark-toggle" onClick={toggleMark}>
        Toggle mark
      </button>
    </>
  );
}

const meta = {
  title: 'Content/Mark',
  component: MarkContractExample,
} satisfies Meta<typeof MarkContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
