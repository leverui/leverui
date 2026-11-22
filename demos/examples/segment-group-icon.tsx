import { type JSX } from '@solidjs/web';
import { Grid2x2Icon, ListIcon, TableIcon } from '@lucide/solid';
import { HStack, SegmentGroup } from '../../src';

/** Combine view-mode icons and labels inside generated items. */
export function SegmentGroupIcon(): JSX.Element {
  return (
    <SegmentGroup.Root defaultValue="table">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items
        items={[
          {
            value: 'table',
            label: (
              <HStack>
                <TableIcon />
                Table
              </HStack>
            ),
          },
          {
            value: 'board',
            label: (
              <HStack>
                <Grid2x2Icon />
                Board
              </HStack>
            ),
          },
          {
            value: 'list',
            label: (
              <HStack>
                <ListIcon />
                List
              </HStack>
            ),
          },
        ]}
      />
    </SegmentGroup.Root>
  );
}
