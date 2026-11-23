import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Grid, GridItem, type GridItemProps } from '../src';

type GetChildProps = Parameters<NonNullable<GridItemProps['asChild']>>[0];

/** Render a GridItem through the native anchor child path. */
function renderItemLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#grid-target" data-testid="grid-item-link">
      Grid link
    </a>
  );
}

/** Exercise Grid and GridItem aliases, native paths, and responsive placement. */
function GridContractExample(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Record the native element supplied to Grid's ref. */
  function markGrid(element: HTMLButtonElement): void {
    element.dataset.gridRef = element.tagName.toLowerCase();
  }

  /** Record the native element supplied to GridItem's ref. */
  function markItem(element: HTMLButtonElement): void {
    element.dataset.itemRef = element.tagName.toLowerCase();
  }

  /** Change the grid tracks and a child span without replacing children. */
  function toggleTracks(): void {
    setWide(!wide());
  }

  return (
    <>
      <style>{`.grid-contract-basic { gap: var(--lui-spacing-4); }
        .grid-contract-item { height: 20px; }
        .grid-contract-override { grid-template-columns: 50px 50px; }
        .grid-contract-item-override { grid-column: 1 / 2; }`}</style>
      <section data-testid="grid-story">
        <Grid
          templateColumns="repeat(3, 40px)"
          class="grid-contract-basic"
          data-testid="grid-basic"
        >
          <GridItem class="grid-contract-item" data-testid="grid-basic-first">
            One
          </GridItem>
          <GridItem colSpan={2} class="grid-contract-item" data-testid="grid-basic-spanning">
            Two
          </GridItem>
        </Grid>
        <Grid inline templateColumns="40px 40px" data-testid="grid-inline">
          Inline grid
        </Grid>
        <Grid
          templateColumns="30px 30px"
          templateRows="20px 20px"
          templateAreas={'"one two" "three three"'}
          autoFlow="row dense"
          autoRows="12px"
          autoColumns="13px"
          column="1 / 3"
          row="1 / 3"
          data-testid="grid-aliases"
        >
          <GridItem area="one" data-testid="grid-area-one">
            One
          </GridItem>
          <GridItem area="two">Two</GridItem>
          <GridItem area="three">Three</GridItem>
        </Grid>
        <Grid
          templateColumns={{ base: '40px 40px', md: '40px 40px 40px' }}
          data-testid="grid-responsive"
        >
          Responsive
        </Grid>
        <Grid templateColumns="repeat(4, 30px)" data-testid="grid-placement">
          <GridItem colSpan={{ base: 2, md: 3 }} data-testid="grid-responsive-span">
            Responsive span
          </GridItem>
          <GridItem colSpan={[1, null, 2]} data-testid="grid-array-span">
            Array span
          </GridItem>
          <GridItem colSpan="auto" rowSpan={2} data-testid="grid-row-span">
            Row span
          </GridItem>
          <GridItem colStart={2} colEnd={4} rowStart={2} rowEnd={3} data-testid="grid-lines">
            Lines
          </GridItem>
        </Grid>
        <Grid
          templateColumns="40px 40px"
          class="grid-contract-override"
          data-testid="grid-css-override"
        />
        <GridItem
          colSpan={2}
          class="grid-contract-item-override"
          data-testid="grid-item-css-override"
        />
        <Grid unstyled inline data-testid="grid-unstyled" />
        <GridItem unstyled colSpan={2} data-testid="grid-item-unstyled" />
        <Grid
          as="button"
          type="button"
          ref={markGrid}
          templateColumns={wide() ? '40px 40px' : '40px'}
          onClick={toggleTracks}
          aria-label="Change grid tracks"
          data-testid="grid-reactive"
        >
          <span data-testid="grid-reactive-child">Live child</span>
        </Grid>
        <Grid templateColumns="repeat(2, 40px)">
          <GridItem
            as="button"
            type="button"
            ref={markItem}
            colSpan={wide() ? 2 : 1}
            onClick={toggleTracks}
            data-testid="grid-item-reactive"
          >
            Live item
          </GridItem>
          <GridItem asChild={renderItemLink} colSpan={2} />
        </Grid>
        <span id="grid-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Grid',
  component: GridContractExample,
} satisfies Meta<typeof GridContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
