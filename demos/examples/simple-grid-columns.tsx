import { type JSX } from '@solidjs/web';
import { Box, GridItem, SimpleGrid } from '../../src';
import './decorative-box.css';
import '../simple-grid-examples.css';

/** Arrange four patterned surfaces in two equally sized columns. */
export function SimpleGridBasic(): JSX.Element {
  return (
    <SimpleGrid columns={2} style={{ gap: '40px' }}>
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </SimpleGrid>
  );
}

/** Fit as many minimum-width columns as the viewport allows. */
export function SimpleGridWithAutofit(): JSX.Element {
  return (
    <SimpleGrid minChildWidth="sm" style={{ gap: '40px' }}>
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </SimpleGrid>
  );
}

/** Span three columns at medium widths for the first item. */
export function SimpleGridWithColSpan(): JSX.Element {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} class="simple-grid-example-span">
      <GridItem colSpan={{ base: 1, md: 3 }}>
        <Box
          class="example-decorative-box"
          data-decorative-width="100%"
          data-decorative-height="20"
        >
          Column 1
        </Box>
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 1 }}>
        <Box
          class="example-decorative-box"
          data-decorative-width="100%"
          data-decorative-height="20"
        >
          Column 2
        </Box>
      </GridItem>
    </SimpleGrid>
  );
}

/** Change from two to three columns at the later breakpoint. */
export function SimpleGridWithColumns(): JSX.Element {
  return (
    <SimpleGrid columns={[2, null, 3]} style={{ gap: '40px' }}>
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </SimpleGrid>
  );
}

/** Set independent row and column gaps. */
export function SimpleGridWithRowAndColGap(): JSX.Element {
  return (
    <SimpleGrid
      columns={2}
      style={{ 'column-gap': 'var(--lui-spacing-2)', 'row-gap': 'var(--lui-spacing-4)' }}
    >
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
      <Box
        class="example-decorative-box"
        data-decorative-width="100%"
        data-decorative-height="20"
      />
    </SimpleGrid>
  );
}
