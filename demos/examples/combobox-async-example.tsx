import { createEffect, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, HStack, Portal, Span, Spinner, useListCollection } from '../../src';
import { searchCrew, type CrewMember } from './crew-roster-data';

/** Load starship crew suggestions as the visitor searches. */
export function ComboboxAsyncExample(): JSX.Element {
  const [inputValue, setInputValue] = createSignal('');
  const { collection, set } = useListCollection<CrewMember>({
    initialItems: [],
    itemToString:
      /** Display the crew member's name as the selected input value. */
      (item) => item.name,
    itemToValue:
      /** Use crew member names as stable selected values. */
      (item) => item.name,
  });
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(
    /** Track the query. */
    () => inputValue(),
    /** Search the latest query's crew members and ignore stale responses. */
    (query) => {
      const controller = new AbortController();
      setLoading(true);
      setError(null);
      searchCrew(query, controller.signal)
        .then(
          /** Publish the crew members from a successful search. */
          (members) => {
            if (!controller.signal.aborted) set(members);
          },
        )
        .catch(
          /** Clear the list and keep the failure message. */
          (cause: unknown) => {
            if (controller.signal.aborted) return;
            set([]);
            setError(cause instanceof Error ? cause.message : 'Could not load the crew');
          },
        )
        .finally(
          /** Stop loading unless a newer query replaced this one. */
          () => {
            if (!controller.signal.aborted) setLoading(false);
          },
        );
      return (
        /** Prevent a previous query from overwriting the current collection. */
        () => controller.abort()
      );
    },
  );

  return (
    <Combobox.Root
      style={{ width: '320px' }}
      collection={collection()}
      onInputValueChange={
        /** Trigger a new crew lookup for the current input. */
        (details) => setInputValue(details.inputValue)
      }
      positioning={{ sameWidth: false, placement: 'bottom-start' }}
    >
      <Combobox.Label>Search starship crew</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content style={{ 'min-width': 'var(--lui-sizes-sm)' }}>
            <Combobox.List>
              {loading() ? (
                <HStack style={{ padding: 'var(--lui-spacing-2)' }}>
                  <Spinner size="xs" style={{ 'border-width': '1px' }} />
                  <Span>Loading...</Span>
                </HStack>
              ) : error() ? (
                <Span
                  style={{
                    padding: 'var(--lui-spacing-2)',
                    color: 'var(--lui-colors-fg-error)',
                  }}
                >
                  Could not load the crew
                </Span>
              ) : (
                <For each={collection().items}>
                  {
                    /** Show each returned crew member's name, role, and station. */
                    (member) => (
                      <Combobox.Item item={member}>
                        <HStack justify="space-between" textStyle="sm">
                          <Span
                            style={{
                              'font-weight': 'var(--lui-font-weights-medium)',
                              overflow: 'hidden',
                              'text-overflow': 'ellipsis',
                              'white-space': 'nowrap',
                            }}
                          >
                            {member.name}
                          </Span>
                          <Span
                            style={{
                              color: 'var(--lui-colors-fg-muted)',
                              overflow: 'hidden',
                              'text-overflow': 'ellipsis',
                              'white-space': 'nowrap',
                            }}
                          >
                            {member.role} / {member.station}
                          </Span>
                        </HStack>
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    )
                  }
                </For>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
