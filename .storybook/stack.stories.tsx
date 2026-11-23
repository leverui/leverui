import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Box,
  HStack,
  Stack,
  StackSeparator,
  VStack,
  type StackProps,
  type StackSeparatorRenderProps,
} from '../src';
import './stack-story.css';

type GetChildProps = Parameters<NonNullable<StackProps['asChild']>>[0];

/** Apply Stack's native styling to a consumer-owned link. */
function renderStackLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#stack-target" data-testid="stack-link">
      Stack link
    </a>
  );
}

/** Add a consumer color while retaining Stack's separator placement. */
function renderCustomSeparator(props: StackSeparatorRenderProps): JSX.Element {
  return (
    <StackSeparator
      {...props}
      style={{ 'border-color': 'var(--lui-colors-red-500)' }}
      data-testid="stack-custom-line"
    />
  );
}

/** Apply Stack's class contract to a plain native separator. */
function renderNativeSeparator(props: StackSeparatorRenderProps): JSX.Element {
  return <hr {...props} data-testid="stack-native-line" />;
}

/** Exercise defaults, wrappers, separators, responsive props, and live children. */
function ReactiveStackExample(): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);
  const [extra, setExtra] = createSignal(false);
  const first = <Box class="stack-story-item" data-testid="stack-reactive-one" />;
  const middle = <Box class="stack-story-item" data-testid="stack-reactive-extra" />;
  const last = <Box class="stack-story-item" data-testid="stack-reactive-two" />;

  /** Change Stack direction and gap without replacing its children. */
  function toggleDirection(): void {
    setHorizontal(!horizontal());
  }

  /** Add or remove a visible Stack item between two stable siblings. */
  function toggleExtra(): void {
    setExtra(!extra());
  }

  /** Return the current items while retaining their native elements. */
  function renderItems(): JSX.Element {
    return extra() ? [first, middle, last] : [first, last];
  }

  return (
    <>
      <Stack
        direction={horizontal() ? 'row' : 'column'}
        gap={horizontal() ? '16px' : '8px'}
        separator={StackSeparator}
        data-testid="stack-reactive"
        renderChildren={renderItems}
      />
      <button type="button" onClick={toggleDirection} data-testid="stack-toggle-direction">
        Change direction
      </button>
      <button type="button" onClick={toggleExtra} data-testid="stack-toggle-extra">
        Change children
      </button>
    </>
  );
}

/** Exercise defaults, wrappers, separators, responsive props, and native APIs. */
function StackContractExample(): JSX.Element {
  /** Record the native navigation element passed through Stack's ref. */
  function markNav(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <section data-testid="stack-story">
        <Stack data-testid="stack-basic">
          <Box class="stack-story-item" data-testid="stack-basic-one" />
          <Box class="stack-story-item" data-testid="stack-basic-two" />
          <Box class="stack-story-item" data-testid="stack-basic-three" />
        </Stack>
        <HStack direction="column" data-testid="stack-horizontal">
          <Box class="stack-story-item" />
          <Box class="stack-story-item" />
        </HStack>
        <VStack direction="row" align="flex-end" data-testid="stack-vertical">
          <Box class="stack-story-item" />
          <Box class="stack-story-item" />
        </VStack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap="8px"
          separator={StackSeparator}
          data-testid="stack-responsive"
        >
          <Box class="stack-story-item" data-testid="stack-responsive-one" />
          <Box class="stack-story-item" data-testid="stack-responsive-two" />
          <Box class="stack-story-item" data-testid="stack-responsive-three" />
        </Stack>
        <Stack separator={renderCustomSeparator} data-testid="stack-custom">
          <Box class="stack-story-item" />
          <Box class="stack-story-item" />
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap="8px"
          separator={renderNativeSeparator}
          data-testid="stack-native-separator"
        >
          <span>First</span>
          <span>Second</span>
        </Stack>
        <ReactiveStackExample />
        <Stack as="nav" ref={markNav} aria-label="Stack navigation" data-testid="stack-nav">
          <a href="#stack-target">Target</a>
        </Stack>
        <Stack asChild={renderStackLink} direction="row" />
        <span id="stack-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Stack',
  component: StackContractExample,
} satisfies Meta<typeof StackContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
