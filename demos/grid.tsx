import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Box, Grid, GridItem } from '../src';
import { withComponentInset } from './examples/example-frame';
import './grid-examples.css';

/** Place three equal patterned cells in a grid. */
function GridBasic(): JSX.Element {
  return (
    <Grid templateColumns="repeat(3, 1fr)" class="grid-example-gap-6">
      <Box class="grid-example-pattern" />
      <Box class="grid-example-pattern" />
      <Box class="grid-example-pattern" />
    </Grid>
  );
}

/** Span rows and columns in the five-column grid. */
function GridSpanningColumns(): JSX.Element {
  return (
    <Grid
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(5, 1fr)"
      class="grid-example-gap-4 grid-example-height"
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Box class="grid-example-pattern grid-example-pattern--fill">rowSpan=2</Box>
      </GridItem>
      <GridItem colSpan={2}>
        <Box class="grid-example-pattern grid-example-pattern--fill">colSpan=2</Box>
      </GridItem>
      <GridItem colSpan={2}>
        <Box class="grid-example-pattern grid-example-pattern--fill">colSpan=2</Box>
      </GridItem>
      <GridItem colSpan={4}>
        <Box class="grid-example-pattern grid-example-pattern--fill">colSpan=4</Box>
      </GridItem>
    </Grid>
  );
}

/** Make the first of three items span two columns. */
function GridWithColSpan(): JSX.Element {
  return (
    <Grid templateColumns="repeat(4, 1fr)" class="grid-example-gap-6">
      <GridItem colSpan={2}>
        <Box class="grid-example-pattern" />
      </GridItem>
      <GridItem colSpan={1}>
        <Box class="grid-example-pattern" />
      </GridItem>
      <GridItem colSpan={1}>
        <Box class="grid-example-pattern" />
      </GridItem>
    </Grid>
  );
}

/** Place five colored cells into named template areas. */
function GridWithTemplateAreas(): JSX.Element {
  return (
    <Grid class="grid-example-gap-4" templateAreas={'"one one two three" "four five five three"'}>
      <GridItem class="grid-example-item--green" area="one">
        <Box class="grid-example-pattern grid-example-pattern--fill">one</Box>
      </GridItem>
      <GridItem class="grid-example-item--pink" area="two">
        <Box class="grid-example-pattern grid-example-pattern--fill">two</Box>
      </GridItem>
      <GridItem class="grid-example-item--red" area="three">
        <Box class="grid-example-pattern grid-example-pattern--fill">three</Box>
      </GridItem>
      <GridItem class="grid-example-item--teal" area="four">
        <Box class="grid-example-pattern grid-example-pattern--fill">four</Box>
      </GridItem>
      <GridItem class="grid-example-item--yellow" area="five">
        <Box class="grid-example-pattern grid-example-pattern--fill">five</Box>
      </GridItem>
    </Grid>
  );
}

export const meta = {
  component: GridBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: GridBasic,
};
export const ColSpan: Story = {
  render: GridWithColSpan,
  parameters: {
    guide: {
      description: 'Pass `colSpan` to make a GridItem span columns.',
    },
  },
};
export const SpanningColumns: Story = {
  name: 'SpanningColumns',
  render: GridSpanningColumns,
  parameters: {
    guide: {
      description: 'Span specific columns or rows in a grid layout.',
    },
  },
};
export const TemplateAreas: Story = {
  name: 'TemplateAreas',
  render: GridWithTemplateAreas,
};
