import { createEffect, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, HStack, Portal, Span, Spinner, useListCollection } from '../../src';
import { searchCrew, type CrewMember } from './crew-roster-data';

/** Rehydrate a preselected crew member after an asynchronous collection loads. */
export function ComboboxRehydrateExample(): JSX.Element {
  const [inputValue, setInputValue] = createSignal('');
  const [hydrated, setHydrated] = createSignal(false);
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

  const store = Combobox.useCombobox(
    /** Supply the latest async collection to the external Combobox store. */
    () => ({
      collection: collection(),
      defaultValue: ['Juno Marchetti'],
      inputValue: inputValue(),
      onInputValueChange:
        /** Keep the external machine's controlled input value current. */
        (details) => setInputValue(details.inputValue),
    }),
  );
  createEffect(
    /** Track whether data has arrived and the selection still needs attaching. */
    () => !hydrated() && collection().items.length > 0,
    /** Attach the default selected item after its data first arrives. */
    (ready) => {
      if (!ready) return;
      store().syncSelectedItems();
      setHydrated(true);
    },
  );

  return (
    <Combobox.RootProvider value={store} style={{ width: '320px' }}>
      <Combobox.Label>Search starship crew</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Status>
              {loading() ? (
                <HStack style={{ padding: 'var(--leverui-spacing-2)' }}>
                  <Spinner size="xs" />
                  <Span>Loading...</Span>
                </HStack>
              ) : error() ? (
                <Span
                  style={{
                    padding: 'var(--leverui-spacing-2)',
                    color: 'var(--leverui-colors-fg-error)',
                  }}
                >
                  {error()}
                </Span>
              ) : null}
            </Combobox.Status>
            <Show when={!loading() && !error()}>
              <Combobox.Empty>No items</Combobox.Empty>
            </Show>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Render each loaded crew member with their role and station. */
                  (member) => (
                    <Combobox.Item item={member}>
                      <HStack justify="space-between" textStyle="sm">
                        <Span style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>
                          {member.name}
                        </Span>
                        <Span style={{ color: 'var(--leverui-colors-fg-muted)' }}>
                          {member.role} / {member.station}
                        </Span>
                      </HStack>
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  )
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.RootProvider>
  );
}
