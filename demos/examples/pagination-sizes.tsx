import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { ButtonGroup, IconButton, Pagination, Stack, usePaginationContext } from '../../src';

/** Show the page controls at four button sizes. */
export function PaginationSizes(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {(size) => (
          <Pagination.Root count={20} pageSize={2} defaultPage={1}>
            <ButtonGroup variant="ghost" size={size}>
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
        )}
      </For>
    </Stack>
  );
}
