import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { GridItem, SimpleGrid, type SimpleGridProps } from '../src';

type GetChildProps = Parameters<NonNullable<SimpleGridProps['asChild']>>[0];

/** Render a native section through the SimpleGrid child path. */
function renderSection(getProps: GetChildProps): JSX.Element {
  return (
    <section {...getProps({ class: 'child-grid' })} data-testid="simple-grid-child">
      <span>Native child</span>
    </section>
  );
}

/** Exercise count, auto-fit, responsive, and native SimpleGrid behavior. */
function SimpleGridContractExample(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Keep a consumer ref attached to the selected native button. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.gridRef = element.tagName.toLowerCase();
  }

  /** Change the track count without replacing mounted children. */
  function toggleColumns(): void {
    setWide(!wide());
  }

  return (
    <>
      <style>{`.simple-grid-contract-basic { width: 260px; gap: var(--leverui-spacing-4); }
        .simple-grid-contract-responsive { width: 400px; gap: 8px; }
        @media (min-width: 48rem) { .simple-grid-contract-responsive { gap: 16px; } }
        .simple-grid-contract-260 { width: 260px; gap: 8px; }
        .simple-grid-contract-250 { width: 250px; gap: 8px; }
        .simple-grid-contract-350 { width: 350px; gap: 8px; }
        .simple-grid-contract-override { grid-template-columns: 80px 90px; }`}</style>
      <SimpleGrid columns={2} class="simple-grid-contract-basic" data-testid="simple-grid-basic">
        <span data-testid="simple-grid-first">First</span>
        <span>Second</span>
      </SimpleGrid>
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        class="simple-grid-contract-responsive"
        data-testid="simple-grid-responsive"
      >
        <GridItem colSpan={{ base: 1, md: 3 }} data-testid="simple-grid-span">
          Span
        </GridItem>
      </SimpleGrid>
      <SimpleGrid
        columns={[2, null, 3]}
        style={{ width: '300px' }}
        data-testid="simple-grid-array"
      />
      <SimpleGrid
        columns={2}
        minChildWidth={0}
        style={{ width: '200px' }}
        data-testid="simple-grid-zero-width"
      />
      <SimpleGrid
        minChildWidth="24"
        columns={1}
        class="simple-grid-contract-260"
        data-testid="simple-grid-token"
      >
        <span>Token one</span>
        <span>Token two</span>
      </SimpleGrid>
      <SimpleGrid
        minChildWidth={111}
        class="simple-grid-contract-250"
        data-testid="simple-grid-pixels"
      >
        <span>Pixel one</span>
        <span>Pixel two</span>
      </SimpleGrid>
      <SimpleGrid
        minChildWidth={{ base: '100px', md: '140px' }}
        class="simple-grid-contract-350"
        data-testid="simple-grid-auto-responsive"
      >
        <span>Responsive one</span>
        <span>Responsive two</span>
        <span>Responsive three</span>
      </SimpleGrid>
      <SimpleGrid
        minChildWidth={['100px', undefined, '140px']}
        class="simple-grid-contract-350"
        data-testid="simple-grid-skipped-width"
      >
        <span>Skipped one</span>
        <span>Skipped two</span>
        <span>Skipped three</span>
      </SimpleGrid>
      <SimpleGrid
        columns={2}
        templateColumns="70px 80px"
        class="simple-grid-contract-override"
        data-testid="simple-grid-override"
      />
      <SimpleGrid columns={2} templateColumns="70px 80px" data-testid="simple-grid-direct" />
      <SimpleGrid asChild={renderSection} columns={2} style={{ width: '200px' }} />
      <SimpleGrid
        as="button"
        type="button"
        ref={markButton}
        columns={wide() ? 3 : 2}
        style={{ width: '240px' }}
        onClick={toggleColumns}
        data-testid="simple-grid-live"
      >
        <span data-testid="simple-grid-live-child">Change columns</span>
      </SimpleGrid>
    </>
  );
}

const meta = {
  title: 'Layout/SimpleGrid',
  component: SimpleGridContractExample,
} satisfies Meta<typeof SimpleGridContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
