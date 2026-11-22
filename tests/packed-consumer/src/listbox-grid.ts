import { createGridCollection, type GridCollection } from '@leverui/components';

type GridItem = { label: string; value: string };

const items: GridItem[] = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' },
  { label: 'Four', value: 'four' },
  { label: 'Five', value: 'five' },
  { label: 'Six', value: 'six' },
  { label: 'Seven', value: 'seven' },
  { label: 'Eight', value: 'eight' },
  { label: 'Nine', value: 'nine' },
];

/** Exercise the installed grid helper and its public generic declaration. */
export const gridCollection: GridCollection<GridItem> = createGridCollection({
  columnCount: 8,
  items,
});
