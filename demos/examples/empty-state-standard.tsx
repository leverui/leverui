import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PaletteIcon, ShoppingCartIcon } from '@lucide/solid';
import { Button, ButtonGroup, EmptyState, List, Stack, VStack } from '../../src';
import './empty-state-examples.css';

/** Render the cart message with a selected Empty State size. */
function CartEmptyState(props: { size?: 'sm' | 'md' | 'lg' }): JSX.Element {
  return (
    <EmptyState.Root size={props.size}>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <ShoppingCartIcon class="example-empty-state-icon" />
        </EmptyState.Indicator>
        <VStack class="example-empty-state-text">
          <EmptyState.Title>Nothing in your cart yet</EmptyState.Title>
          <EmptyState.Description>Add a product and it will show up here.</EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}

/** Show the default empty cart presentation. */
export function EmptyStateBasic(): JSX.Element {
  return <CartEmptyState />;
}

/** Render one empty cart at a size. */
function renderSizedCart(size: 'sm' | 'md' | 'lg'): JSX.Element {
  return <CartEmptyState size={size} />;
}

/** Show the three Empty State sizes in a vertical stack. */
export function EmptyStateSizes(): JSX.Element {
  return (
    <Stack>
      <For each={['sm', 'md', 'lg'] as const}>{renderSizedCart}</For>
    </Stack>
  );
}

/** Show a token creation prompt with two actions. */
export function EmptyStateWithAction(): JSX.Element {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <PaletteIcon class="example-empty-state-icon" />
        </EmptyState.Indicator>
        <VStack class="example-empty-state-text">
          <EmptyState.Title>No color themes yet</EmptyState.Title>
          <EmptyState.Description>
            Create a theme or import one you already have.
          </EmptyState.Description>
        </VStack>
        <ButtonGroup>
          <Button>Create theme</Button>
          <Button variant="outline">Import</Button>
        </ButtonGroup>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}

/** Show search advice with a two-item marker list. */
export function EmptyStateWithList(): JSX.Element {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <PaletteIcon class="example-empty-state-icon" />
        </EmptyState.Indicator>
        <VStack class="example-empty-state-text">
          <EmptyState.Title>No matching colors</EmptyState.Title>
          <EmptyState.Description>Change your search and try again.</EmptyState.Description>
        </VStack>
        <List.Root variant="marker">
          <List.Item>Remove a filter</List.Item>
          <List.Item>Search for a different word</List.Item>
        </List.Root>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
