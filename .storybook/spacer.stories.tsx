import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Flex, Spacer, type SpacerProps } from '../src';
import './spacer-contract.css';

type GetChildProps = Parameters<NonNullable<SpacerProps['asChild']>>[0];

/** Render a native link with Spacer's composed styles and attributes. */
function renderSpacerLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#spacer-target" data-testid="spacer-link">
      Link space
    </a>
  );
}

/** Exercise flexible spacing, native paths, reactive props, and CSS overrides. */
function SpacerContractExample(): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);

  /** Record the native button received through Spacer's public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Increase the button spacer's share of available width. */
  function toggleExpansion(): void {
    setExpanded(!expanded());
  }

  return (
    <>
      <section data-testid="spacer-story">
        <Flex class="spacer-contract-row" data-testid="spacer-row">
          <Box class="spacer-contract-width-40" data-testid="spacer-row-first">
            First
          </Box>
          <Spacer data-testid="spacer-row-fill" />
          <Box class="spacer-contract-width-40" data-testid="spacer-row-last">
            Last
          </Box>
        </Flex>
        <Flex direction="column" class="spacer-contract-column" data-testid="spacer-column">
          <Box class="spacer-contract-height-20" data-testid="spacer-column-first">
            First
          </Box>
          <Spacer data-testid="spacer-column-fill" />
          <Box class="spacer-contract-height-20" data-testid="spacer-column-last">
            Last
          </Box>
        </Flex>
        <Flex class="spacer-contract-row" data-testid="spacer-reactive-row">
          <Box class="spacer-contract-width-40">First</Box>
          <Spacer
            as="button"
            type="button"
            ref={markButton}
            flex={expanded() ? 2 : 1}
            onClick={toggleExpansion}
            aria-label="Expand spacer"
            data-testid="spacer-reactive"
          >
            <span data-testid="spacer-reactive-child">Space</span>
          </Spacer>
          <Spacer data-testid="spacer-reactive-peer" />
          <Box class="spacer-contract-width-40">Last</Box>
        </Flex>
        <Flex class="spacer-contract-short-row">
          <Spacer flex={2} data-testid="spacer-direct-override" />
          <Spacer style={{ flex: 3 }} data-testid="spacer-style-override" />
          <Spacer unstyled data-testid="spacer-unstyled" />
        </Flex>
        <Flex class="spacer-contract-responsive-row">
          <Spacer flex={{ base: 1, md: 2 }} data-testid="spacer-responsive" />
          <Spacer data-testid="spacer-responsive-peer" />
        </Flex>
        <Flex class="spacer-contract-responsive-row">
          <Spacer asChild={renderSpacerLink} aria-label="Spacer link" />
          <Spacer data-testid="spacer-link-peer" />
        </Flex>
        <span id="spacer-target">Target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Spacer',
  component: SpacerContractExample,
} satisfies Meta<typeof SpacerContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
