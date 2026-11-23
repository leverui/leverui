import './icon.css';
import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Icon, IconPropsProvider, createIcon, type IconProps } from '../src';

type GetIconChildProps = Parameters<NonNullable<IconProps<'svg'>['asChild']>>[0];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const SquareIcon = createIcon({ d: 'M3 3h18v18H3z', displayName: 'SquareIcon' });

/** Represent a custom path that has no content for the factory fallback. */
function renderEmptyPath(): null {
  return null;
}

const FallbackIcon = createIcon({ path: renderEmptyPath, d: 'M1 1h2v2H1z' });

/** Render a consumer-owned SVG with its own viewBox. */
function renderCustomSvg(getProps: GetIconChildProps): JSX.Element {
  return (
    <svg {...getProps()} viewBox="0 0 32 32" data-testid="icon-custom-svg">
      <circle cx="16" cy="16" r="10" fill="currentColor" />
    </svg>
  );
}

/** Exercise authored sizes, native SVG semantics, composition, and live defaults. */
function IconContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Render one named size in the visual matrix. */
  function renderSize(size: (typeof sizes)[number]): JSX.Element {
    return (
      <Icon size={size} data-testid={`icon-size-${size}`} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="currentColor" />
      </Icon>
    );
  }

  /** Keep the inherited SVG mounted while its authored size changes. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <div data-testid="icon-contract">
        <Icon data-testid="icon-default" viewBox="0 0 24 24">
          <path d="M2 2h20v20H2z" fill="currentColor" />
        </Icon>
        <For each={sizes}>{renderSize}</For>
        <Icon size={{ base: 'xs', md: 'lg' }} data-testid="icon-responsive" />
        <Icon size="sm" class="icon-custom-size" data-testid="icon-custom-size" />
        <Icon unstyled class="icon-unstyled" data-testid="icon-unstyled" />
        <Icon role="img" aria-label="Saved" aria-hidden="false" data-testid="icon-named" />
        <Icon style={{ color: 'var(--lui-colors-red-500)' }} size="lg" data-testid="icon-colored" />
        <Icon class="icon-consumer-color" data-testid="icon-css" />
        <Icon asChild={renderCustomSvg} size="lg" />
        <SquareIcon size="sm" data-testid="icon-created" />
        <FallbackIcon data-testid="icon-fallback" />
        <IconPropsProvider value={{ size: large() ? 'lg' : 'xs', title: 'Shared icon' }}>
          <Icon data-testid="icon-inherited" />
          <Icon size="sm" title="Local icon" data-testid="icon-fixed" />
        </IconPropsProvider>
        <IconPropsProvider value={{ as: 'span', title: 'Shared tag' }}>
          <Icon data-testid="icon-provider-as" />
          <Icon as="svg" data-testid="icon-provider-as-override" />
        </IconPropsProvider>
        <button type="button" onClick={toggleSize} data-testid="icon-toggle">
          Toggle Icon size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Icon',
  component: IconContractExample,
} satisfies Meta<typeof IconContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
