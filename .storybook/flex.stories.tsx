import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Flex, type FlexProps } from '../src';
import './flex-contract.css';

type GetChildProps = Parameters<NonNullable<FlexProps['asChild']>>[0];

/** Render a native link with Flex's composed attributes. */
function renderFlexLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#flex-target" data-testid="flex-link">
      Flex link
    </a>
  );
}

/** Exercise Flex aliases, native paths, responsive values, and child layout. */
function FlexContractExample(): JSX.Element {
  const [column, setColumn] = createSignal(false);

  /** Record the selected native button received through the public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the native Flex button's direction and display without remounting. */
  function toggleDirection(): void {
    setColumn(!column());
  }

  return (
    <>
      <section data-testid="flex-story">
        <Flex class="flex-contract-default" data-testid="flex-default">
          <Box class="flex-contract-item" data-testid="flex-first-item">
            A
          </Box>
          <Box class="flex-contract-item" data-testid="flex-second-item">
            B
          </Box>
        </Flex>
        <Flex inline class="flex-contract-inline" data-testid="flex-inline">
          Inline flex
        </Flex>
        <Flex
          class="flex-contract-aliases"
          direction="column"
          align="center"
          justify="space-between"
          wrap="wrap"
          basis="40px"
          grow={2}
          shrink={0}
          data-testid="flex-aliases"
        >
          <Box class="flex-contract-item" data-testid="flex-alias-first">
            A
          </Box>
          <Box class="flex-contract-item" data-testid="flex-alias-second">
            B
          </Box>
        </Flex>
        <Flex direction={{ base: 'row', md: 'column' }} data-testid="flex-responsive">
          Responsive
        </Flex>
        <Flex basis="10" data-testid="flex-token-basis">
          Token basis
        </Flex>
        <Flex class="flex-contract-width-120" wrap="wrap" data-testid="flex-wrapped">
          <Box class="flex-contract-wrap-item" data-testid="flex-wrap-first">
            A
          </Box>
          <Box class="flex-contract-wrap-item" data-testid="flex-wrap-second">
            B
          </Box>
          <Box class="flex-contract-wrap-item" data-testid="flex-wrap-third">
            C
          </Box>
        </Flex>
        <Flex class="flex-contract-width-120" data-testid="flex-ordered">
          <Box class="flex-contract-order-later" data-testid="flex-order-later">
            Later
          </Box>
          <Box class="flex-contract-order-first" data-testid="flex-order-first">
            First
          </Box>
        </Flex>
        <Flex class="flex-contract-width-120" data-testid="flex-auto-margin">
          <Box class="flex-contract-width-20" data-testid="flex-auto-first">
            A
          </Box>
          <Box class="flex-contract-auto-item" data-testid="flex-auto-item">
            B
          </Box>
        </Flex>
        <Flex direction="column" class="flex-contract-override" data-testid="flex-class-override" />
        <Flex
          direction="column"
          class="flex-contract-position"
          data-testid="flex-position-override"
        />
        <Flex unstyled data-testid="flex-unstyled">
          Unstyled flex
        </Flex>
        <Flex unstyled inline direction="column" data-testid="flex-unstyled-inline">
          Unstyled inline flex
        </Flex>
        <Flex
          as="button"
          type="button"
          ref={markButton}
          inline={column()}
          direction={column() ? 'column' : 'row'}
          onClick={toggleDirection}
          aria-label="Change flex direction"
          data-testid="flex-reactive"
        >
          <span data-testid="flex-reactive-child">Live child</span>
        </Flex>
        <Flex asChild={renderFlexLink} inline aria-label="Flex link" />
        <span id="flex-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Flex',
  component: FlexContractExample,
} satisfies Meta<typeof FlexContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
