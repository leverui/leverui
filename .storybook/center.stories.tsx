import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Center, type CenterProps } from '../src';
import './center-contract.css';

type GetChildProps = Parameters<NonNullable<CenterProps['asChild']>>[0];

/** Render a native link with Center's composed styles and attributes. */
function renderCenterLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#center-target" data-testid="center-link">
      Centered link
    </a>
  );
}

/** Exercise flex geometry, inline variants, native refs, and live styles. */
function CenterContractExample(): JSX.Element {
  const [inline, setInline] = createSignal(false);

  /** Record the selected native section received through the public ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change display without remounting the Center or its child. */
  function toggleInline(): void {
    setInline(!inline());
  }

  return (
    <>
      <section data-testid="center-story">
        <Center class="center-contract-default" data-testid="center-default">
          <Box class="center-contract-child" data-testid="center-default-child">
            Center
          </Box>
        </Center>
        <Center inline class="center-contract-inline" data-testid="center-inline">
          <span>Inline</span>
          <span>content</span>
        </Center>
        <Center inline={{ base: false, md: true }} data-testid="center-responsive-object">
          Responsive object
        </Center>
        <Center inline={[false, null, true]} data-testid="center-responsive-array">
          Responsive array
        </Center>
        <Center inline={{ md: true }} data-testid="center-conditional-only">
          Conditional only
        </Center>
        <Center inline={[null, null, true]} data-testid="center-open-base-array">
          Open base array
        </Center>
        <Center
          as="section"
          ref={markSection}
          inline={inline()}
          class="center-contract-reactive"
          aria-label="Reactive center"
          data-testid="center-reactive"
        >
          <span data-testid="center-reactive-child">Live child</span>
        </Center>
        <Center asChild={renderCenterLink} inline aria-label="Centered link" />
        <Center unstyled class="center-contract-unstyled" data-testid="center-unstyled">
          Unstyled center
        </Center>
        <Center class="center-contract-custom" data-testid="center-custom-css">
          <span data-testid="center-custom-child">Custom</span>
        </Center>
        <span id="center-target">Link target</span>
        <button type="button" onClick={toggleInline} data-testid="center-toggle">
          Change center display
        </button>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Center',
  component: CenterContractExample,
} satisfies Meta<typeof CenterContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
