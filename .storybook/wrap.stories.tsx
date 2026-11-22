import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Wrap, WrapItem, type WrapProps } from '../src';
import './wrap-contract.css';

type GetChildProps = Parameters<NonNullable<WrapProps['asChild']>>[0];

/** Apply Wrap's native props to a consumer-owned section. */
function renderWrapSection(getProps: GetChildProps): JSX.Element {
  return <section {...getProps()} />;
}

/** Apply WrapItem's native props to a consumer-owned link. */
function renderWrapLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#wrap-target">
      Wrapped link
    </a>
  );
}

/** Show the layout options and native Solid rendering paths. */
function WrapContractExample(): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);

  /** Record the selected button passed through WrapItem's public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the root spacing without replacing its child button. */
  function toggleGap(): void {
    setExpanded(!expanded());
  }

  return (
    <>
      <section data-testid="wrap-story">
        <Wrap class="wrap-contract-width-112" data-testid="wrap-default">
          <Box class="wrap-contract-item-48" data-testid="wrap-first">
            One
          </Box>
          <Box class="wrap-contract-item-48" data-testid="wrap-second">
            Two
          </Box>
          <Box class="wrap-contract-item-48" data-testid="wrap-third">
            Three
          </Box>
        </Wrap>
        <Wrap
          class="wrap-contract-width-140"
          gap={{ base: '2', md: '4' }}
          rowGap={{ base: '4px', md: '12px' }}
          columnGap={{ base: '8px', md: '16px' }}
          justify={{ base: 'center', md: 'space-between' }}
          align="center"
          direction={{ base: 'row', md: 'row-reverse' }}
          data-testid="wrap-responsive"
        >
          <Box class="wrap-contract-item-56">One</Box>
          <Box class="wrap-contract-item-56">Two</Box>
          <Box class="wrap-contract-item-56">Three</Box>
        </Wrap>
        <Wrap gap="10px" data-testid="wrap-item-root">
          <WrapItem class="wrap-contract-item-48" data-testid="wrap-item-default">
            Item
          </WrapItem>
          <WrapItem class="wrap-contract-item-centered" data-testid="wrap-item-css">
            Styled item
          </WrapItem>
        </Wrap>
        <Wrap class="wrap-contract-override" data-testid="wrap-override">
          Override
        </Wrap>
        <Wrap unstyled gap="4" align="center" data-testid="wrap-unstyled">
          Unstyled
        </Wrap>
        <WrapItem unstyled data-testid="wrap-item-unstyled">
          Unstyled item
        </WrapItem>
        <Wrap gap={expanded() ? '4' : '2'} data-testid="wrap-reactive">
          <WrapItem
            as="button"
            type="button"
            ref={markButton}
            onClick={toggleGap}
            aria-label="Change wrap gap"
            data-testid="wrap-button"
          >
            <span data-testid="wrap-button-child">Button child</span>
          </WrapItem>
        </Wrap>
        <Wrap asChild={renderWrapSection} gap="4" data-testid="wrap-as-child">
          <WrapItem>Section child</WrapItem>
        </Wrap>
        <WrapItem asChild={renderWrapLink} aria-label="Wrapped link" />
        <span id="wrap-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Wrap',
  component: WrapContractExample,
} satisfies Meta<typeof WrapContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
