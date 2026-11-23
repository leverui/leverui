import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Heading, Highlight, Stack, Text } from '../../src';

/** Emphasize the single search term. */
export function HighlightBasic(): JSX.Element {
  return (
    <Highlight
      query="Thursday"
      markStyle={{
        'padding-inline': '2px',
        'background-color': 'var(--lui-colors-orange-subtle)',
        color: 'var(--lui-colors-orange-fg)',
      }}
    >
      Your parcel arrives on Thursday before noon.
    </Highlight>
  );
}

/** Emphasize three terms in the heading. */
export function HighlightMultiple(): JSX.Element {
  return (
    <Heading style={{ 'line-height': 'var(--lui-line-heights-tall)' }}>
      <Highlight
        query={['helmet', 'gloves', 'water bottle']}
        markStyle={{
          'padding-inline': '2px',
          'background-color': 'var(--lui-colors-teal-muted)',
        }}
      >
        Bring a helmet, gloves and a water bottle on the ride.
      </Highlight>
    </Heading>
  );
}

const searchResults = ['Desktop organizer', 'Desk lamp', 'Desk chair'] as const;

/** Mark a case-insensitive query in the three search results. */
export function HighlightSearchQuery(): JSX.Element {
  return (
    <Stack gap="6">
      <Text>Search results for: desk</Text>
      <Stack gap="1">
        <For each={searchResults}>
          {
            /** Show one result with its matched prefix emphasized. */
            (item) => (
              <p>
                <Highlight
                  ignoreCase
                  query="desk"
                  markStyle={{ 'font-weight': 'var(--lui-font-weights-semibold)' }}
                >
                  {item}
                </Highlight>
              </p>
            )
          }
        </For>
      </Stack>
    </Stack>
  );
}

/** Apply the custom font weight to one matched word. */
export function HighlightWithCustomStyle(): JSX.Element {
  return (
    <Highlight query="6 pm" markStyle={{ 'font-weight': 'var(--lui-font-weights-semibold)' }}>
      The library closes at 6 pm on weekdays.
    </Highlight>
  );
}
