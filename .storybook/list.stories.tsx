import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import * as List from '../src/components/list';
import type {
  ListIndicatorProps,
  ListItemProps,
  ListRootProps,
} from '../src/components/list-props';
import { Theme } from '../src/components/theme';
import './list-contract.css';

type GetIndicatorProps = Parameters<NonNullable<ListIndicatorProps['asChild']>>[0];
type GetRootProps = Parameters<NonNullable<ListRootProps['asChild']>>[0];
type GetItemProps = Parameters<NonNullable<ListItemProps['asChild']>>[0];

/** Mark the selected ordered root through its parent ref. */
function markChildRoot(element: HTMLElement): void {
  element.setAttribute('data-root-ref', 'received');
}

/** Render an ordered list selected by the root child contract. */
function renderChildRoot(getProps: GetRootProps): JSX.Element {
  return <ol {...getProps({ class: 'consumer-list-root' })} id="list-child-root" start={4} />;
}

/** Mark the selected list item through its parent ref. */
function markChildItem(element: HTMLLIElement): void {
  element.setAttribute('data-item-ref', 'received');
}

/** Render a consumer-owned native list item with inherited children. */
function renderChildItem(getProps: GetItemProps): JSX.Element {
  return <li {...getProps({ class: 'consumer-list-item' })} id="list-child-item" />;
}

/** Record the selected consumer-owned icon through the parent part ref. */
function markIcon(element: Element): void {
  element.setAttribute('data-parent-ref', 'received');
}

/** Record the consumer's own SVG ref after List merges attributes. */
function markChildIcon(element: SVGSVGElement): void {
  element.setAttribute('data-child-ref', 'received');
}

/** Render an SVG with its own class and accessible name under List styling. */
function renderIcon(getProps: GetIndicatorProps): JSX.Element {
  return (
    <svg
      {...getProps({
        class: 'consumer-list-icon',
        role: 'img',
        'aria-label': 'Complete',
        ref: markChildIcon,
        viewBox: '0 0 24 24',
      })}
      data-testid="list-indicator"
    >
      <path d="M5 12l4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
  );
}

/** Style a consumer-owned list item through the public part class. */
function ListClassProbe(props: { testId: string }): JSX.Element {
  return (
    <li class="leverui-list__item" data-testid={props.testId}>
      Custom item
    </li>
  );
}

/** Show semantic lists, CSS variants, indicators, and nested roots. */
function ListContract(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Switch inherited list styling without replacing its nodes. */
  function toggleVariant(): void {
    setPlain(!plain());
  }

  return (
    <div style={{ padding: '24px', display: 'grid', gap: '20px' }}>
      <List.Root data-testid="list-default" title="Tasks">
        <List.Item data-testid="list-default-item">First task</List.Item>
        <List.Item>Second task</List.Item>
      </List.Root>
      <List.Root
        as="ol"
        start={3}
        style={{ 'list-style-type': 'decimal' }}
        data-testid="list-ordered"
      >
        <List.Item class="list-contract-marker" data-testid="list-ordered-item">
          Third task
        </List.Item>
        <List.Item>Fourth task</List.Item>
      </List.Root>
      <List.Root
        variant="plain"
        align="center"
        style={{ '--lui-list-gap': 'var(--lui-spacing-2)' }}
        data-testid="list-icon"
      >
        <List.Item data-testid="list-icon-item">
          <List.Indicator
            asChild={renderIcon}
            style={{
              color: plain() ? 'var(--lui-colors-blue-500)' : 'var(--lui-colors-green-500)',
            }}
            ref={markIcon}
          />
          Checked item
        </List.Item>
      </List.Root>
      <List.Root variant="plain" align="start" data-testid="list-align-start">
        <List.Item data-testid="list-align-start-item">Start aligned</List.Item>
      </List.Root>
      <List.Root variant="plain" align="end" data-testid="list-align-end">
        <List.Item data-testid="list-align-end-item">End aligned</List.Item>
      </List.Root>
      <List.Root
        variant="plain"
        align={{ base: 'start', md: 'end' }}
        data-testid="list-align-responsive"
      >
        <List.Item data-testid="list-align-responsive-item">Responsive alignment</List.Item>
      </List.Root>
      <List.Root variant={{ base: 'marker', md: 'plain' }}>
        <List.Item data-testid="list-variant-responsive-item">Responsive marker</List.Item>
      </List.Root>
      <List.Root variant="plain" data-testid="list-nested-outer">
        <List.Item>
          Parent item
          <List.Root
            style={{ 'padding-inline-start': 'var(--lui-spacing-5)' }}
            variant="marker"
            data-testid="list-nested-inner"
          >
            <List.Item data-testid="list-nested-item">Nested item</List.Item>
          </List.Root>
        </List.Item>
      </List.Root>
      <List.RootPropsProvider value={{ variant: plain() ? 'plain' : 'marker' }}>
        <List.Root asChild={renderChildRoot} ref={markChildRoot} title="Owned tasks">
          <List.Item asChild={renderChildItem} ref={markChildItem}>
            Selected child item
          </List.Item>
        </List.Root>
        <List.Root data-testid="list-reactive">
          <List.Item data-testid="list-reactive-item">Changing item</List.Item>
          <ListClassProbe testId="list-reactive-probe" />
          <List.Item>
            <List.Root variant="marker" data-testid="list-probe-nested-root">
              <ListClassProbe testId="list-probe-nested" />
            </List.Root>
          </List.Item>
        </List.Root>
        <List.Root variant="marker" data-testid="list-fixed">
          <List.Item data-testid="list-fixed-item">Fixed item</List.Item>
        </List.Root>
      </List.RootPropsProvider>
      <List.Root unstyled data-testid="list-unstyled">
        <List.Item unstyled data-testid="list-unstyled-item">
          Raw item
        </List.Item>
      </List.Root>
      <List.Root variant="plain">
        <List.Item>
          <List.Indicator unstyled data-testid="list-unstyled-indicator">
            Raw
          </List.Indicator>
        </List.Item>
      </List.Root>
      <Theme appearance="dark" hasBackground={false}>
        <List.Root data-testid="list-dark">
          <List.Item data-testid="list-dark-item">Dark item</List.Item>
        </List.Root>
      </Theme>
      <button type="button" data-testid="list-toggle" onClick={toggleVariant}>
        Toggle list variant
      </button>
    </div>
  );
}

const meta = {
  title: 'Content/List',
  component: ListContract,
} satisfies Meta<typeof ListContract>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
