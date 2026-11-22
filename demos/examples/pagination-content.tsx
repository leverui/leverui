import { createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { ButtonGroup, IconButton, Pagination, Stack, Text, usePaginationContext } from '../../src';

const items = Array.from(
  { length: 50 },
  /** Give each page item the numbered copy. */
  (_, index) => `Support ticket ${index + 1}`,
);

/** Pair controlled page selection with its five visible content lines. */
export function PaginationContent(): JSX.Element {
  const [page, setPage] = createSignal(1);
  const visible = createMemo(
    /** Read only the five items selected by the current page. */
    () => items.slice((page() - 1) * 5, page() * 5),
  );
  return (
    <Stack gap="4">
      <Stack>
        <For each={visible()}>{(item) => <Text>{item}</Text>}</For>
      </Stack>
      <Pagination.Root
        count={50}
        pageSize={5}
        page={page()}
        onPageChange={
          /** Update the current content range after a page change. */
          (details) => setPage(details.page)
        }
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger
            asChild={(getProps) => (
              <IconButton {...getProps()}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          />
          <Pagination.Items
            render={(page, getProps) => (
              <IconButton
                {...getProps()}
                variant={usePaginationContext()().page === page.value ? 'outline' : 'ghost'}
              >
                {page.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger
            asChild={(getProps) => (
              <IconButton {...getProps()}>
                <ChevronRightIcon />
              </IconButton>
            )}
          />
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
}
