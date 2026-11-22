import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Badge, BadgePropsProvider, type BadgeProps } from '../src';
import './badge-contract.css';

type GetBadgeChildProps = Parameters<NonNullable<BadgeProps['asChild']>>[0];

/** Render Badge attributes and classes on a consumer-owned strong element. */
function renderStrong(getProps: GetBadgeChildProps): JSX.Element {
  return (
    <strong {...getProps({})} data-testid="badge-child">
      Important
    </strong>
  );
}

/** Exercise Badge defaults, native rendering, and Solid composition. */
function BadgeContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [alternate, setAlternate] = createSignal(false);

  /** Record the default native Badge ref. */
  function markSpan(element: HTMLSpanElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Record the selected section ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Update the inherited Badge size in place. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change a mounted Badge's variant and palette together. */
  function toggleAppearance(): void {
    setAlternate(!alternate());
  }

  return (
    <div data-testid="badge-contract">
      <Badge ref={markSpan} data-testid="badge-default" title="Current status">
        Active
      </Badge>
      <BadgePropsProvider
        value={{ size: large() ? 'lg' : 'xs', variant: 'outline', class: 'provider-badge' }}
      >
        <Badge data-testid="badge-inherited">Inherited</Badge>
        <Badge class="fixed-badge" data-testid="badge-fixed" size="sm" variant="solid">
          Fixed
        </Badge>
      </BadgePropsProvider>
      <Badge as="section" ref={markSection} data-testid="badge-section">
        Section
      </Badge>
      <Badge asChild={renderStrong} />
      <Badge unstyled data-testid="badge-unstyled">
        Bare
      </Badge>
      <Badge class="badge-contract-custom" data-testid="badge-custom">
        Custom
      </Badge>
      <Badge size={{ base: 'xs', md: 'lg' }} data-testid="badge-responsive">
        Responsive
      </Badge>
      <Badge
        variant={alternate() ? 'outline' : 'solid'}
        colorPalette={alternate() ? 'green' : 'blue'}
        data-testid="badge-reactive"
      >
        Reactive
      </Badge>
      <button type="button" data-testid="badge-toggle" onClick={toggleSize}>
        Toggle size
      </button>
      <button type="button" data-testid="badge-appearance-toggle" onClick={toggleAppearance}>
        Toggle appearance
      </button>
    </div>
  );
}

const meta = {
  title: 'Content/Badge',
  component: BadgeContractExample,
} satisfies Meta<typeof BadgeContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
