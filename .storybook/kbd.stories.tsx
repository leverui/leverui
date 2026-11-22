import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Kbd, KbdPropsProvider, Theme, type KbdProps } from '../src';
import './kbd-custom.css';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['raised', 'outline', 'subtle', 'plain'] as const;
type GetChildProps = Parameters<NonNullable<KbdProps['asChild']>>[0];

/** Apply Kbd attributes to a consumer-owned span. */
function renderSpan(getProps: GetChildProps): JSX.Element {
  return (
    <span {...getProps()} data-testid="kbd-child">
      ⌘
    </span>
  );
}

/** Display authored Kbd choices and live provider behavior. */
function KbdContract(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Record the selected element received by a native ref. */
  function markSelected(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change a provider default without replacing its descendants. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <p>
        Press <Kbd data-testid="kbd-default">F12</Kbd> to open DevTools.
      </p>
      <div data-testid="kbd-combination">
        <Kbd>ctrl</Kbd>+<Kbd>shift</Kbd>+<Kbd>del</Kbd>
      </div>
      {sizes.map(
        /** Render every size. */
        (size) => (
          <Kbd size={size} data-testid={`kbd-${size}`}>
            {size}
          </Kbd>
        ),
      )}
      {variants.map(
        /** Render every appearance. */
        (variant) => (
          <Kbd variant={variant} colorPalette="blue" data-testid={`kbd-${variant}`}>
            {variant}
          </Kbd>
        ),
      )}
      <Kbd variant="raised" colorPalette="green" data-testid="kbd-green">
        Green key
      </Kbd>
      <Kbd size={{ base: 'sm', md: 'lg' }} data-testid="kbd-responsive">
        Responsive
      </Kbd>
      <Kbd variant={{ base: 'raised', md: 'plain' }} data-testid="kbd-responsive-variant">
        Responsive treatment
      </Kbd>
      <KbdPropsProvider
        value={{
          size: large() ? 'lg' : 'sm',
          variant: 'outline',
          title: 'Shared shortcut',
          class: 'provider-kbd',
        }}
      >
        <Kbd data-testid="kbd-inherited">Esc</Kbd>
        <Kbd class="fixed-kbd" size="md" data-testid="kbd-fixed">
          Enter
        </Kbd>
      </KbdPropsProvider>
      <Kbd as="span" ref={markSelected} data-testid="kbd-selected">
        Selected
      </Kbd>
      <Kbd asChild={renderSpan} aria-label="Command key" />
      <Kbd unstyled data-testid="kbd-unstyled">
        Plain
      </Kbd>
      <Kbd class="kbd-custom-spacing" data-testid="kbd-custom-spacing">
        Custom
      </Kbd>
      <Kbd class="kbd-custom-color" data-testid="kbd-css">
        Local CSS
      </Kbd>
      <Kbd variant="raised" colorPalette="blue" data-testid="kbd-light">
        Light key
      </Kbd>
      <Theme appearance="dark" hasBackground={false}>
        <Kbd variant="raised" colorPalette="blue" data-testid="kbd-dark">
          Dark key
        </Kbd>
        <Theme appearance="light" hasBackground={false}>
          <Kbd variant="raised" colorPalette="blue" data-testid="kbd-nested-light">
            Nested light key
          </Kbd>
        </Theme>
      </Theme>
      <button type="button" data-testid="kbd-toggle" onClick={toggleSize}>
        Toggle size
      </button>
    </>
  );
}

const meta = {
  title: 'Content/Kbd',
  component: KbdContract,
} satisfies Meta<typeof KbdContract>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
