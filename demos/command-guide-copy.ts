/** Website guide copy for each Command example, from the page. */
interface GuideParameters {
  readonly guide: { readonly description: string; readonly after?: string };
}

/** Pair a description with optional Markdown shown after the example. */
function copy(description: string, after?: string): GuideParameters {
  return { guide: { description, ...(after && { after }) } };
}

export const guide = {
  inline: copy(
    'Render `Command.Root` without a dialog and pass the collection with the `command` prop. Add a `Command.Label` to name the search, visually hidden if needed. In a dialog, the hidden title from `Command.DialogContent` names it instead.',
  ),
  groups: copy(
    'Pass `groupBy` to `useCommandCollection`. Items are ranked within each group, and the group order stays fixed while you type.',
  ),
  keywords: copy(
    'Add `keywords` to an item so other words find it, like "preferences" for Settings. Keyword matches rank just below label matches.',
    `### Highlight Matches

Set \`highlight\` on \`ItemText\` to bold the matched characters, including fuzzy and camelCase matches.

\`\`\`tsx
<Command.ItemText highlight>{item.label}</Command.ItemText>
\`\`\``,
  ),
  controlledSearch: copy(
    'Pass `query` and `onQueryChange` to keep the query in your own state, for example to sync it with the URL.',
  ),
  prefixSearch: copy(
    'Type `>`, `@`, or `#` first to search only commands, people, or channels. Backspace on an empty input clears the scope.',
  ),
  tabs: copy('Filter the items by the active tab.'),
  asyncContent: copy(
    'Pass `load` to fetch items as you type. Stale requests are cancelled, and `Loading` and `Empty` never show at the same time.',
  ),
  loadMore: copy(
    'Return `{ items, cursor }` from `load` to page through results. Call `command().loadMore()` when the user reaches the end of the list and `command().hasMore` is `true`.',
    `### Bring Your Own Data

To fetch with your own data layer, such as TanStack Query, control the query and pass the results in. Set \`filter: null\` so server results show as returned.

\`\`\`tsx
const [query, setQuery] = createSignal('');
const people = useQuery(() => ({
  queryKey: ['people', query()],
  queryFn: () => searchPeople(query()),
}));

const command = useCommandCollection(() => ({
  initialItems: people.data ?? [],
  query: query(),
  onQueryChange: setQuery,
  filter: null,
}));

<Command.Root command={command} loading={people.isFetching}>
  {/* ... */}
</Command.Root>;
\`\`\``,
  ),
  nested: copy(
    "Give an item a `parent` to put it on that item's page. Nothing else changes in the markup.",
    `\`\`\`tsx
const command = useCommandCollection({
  initialItems: [
    { label: 'Change status...', value: 'status' },
    { label: 'Done', value: 'status:done', parent: 'status' },
  ],
  deepSearch: true,
});
\`\`\`

- Selecting an item with children opens its page.
- Escape goes back to the previous page, then closes the dialog.
- Backspace on an empty input goes up a page.
- Going back restores the query and highlights the item you came from.
- \`command().pages\` is the trail of open pages, for a breadcrumb.
- With \`deepSearch\`, a query also matches items in nested pages. \`command().getPath(item)\` returns where a match lives.
- To open a page directly, such as from a shortcut, call \`command().reset('status')\` before opening the dialog. Escape then closes it.`,
  ),
  asyncPages: copy(
    'Set `page: true` on an item to open a page that loads its own items. `load` receives the current `page` and reloads when it changes.',
  ),
  inputPage: copy(
    'Build a page\'s items from the query, such as "Rename to …" or "Invite by email".',
  ),
  hotkeys: copy(
    'Register the same items with `useHotkeys` so their shortcuts work while the menu is closed. Format them per platform with `useFormatHotkey`.',
  ),
  store: copy(
    "Use `useCommand` with `Command.RootProvider` to work with the command's state from outside, such as controlling the dialog from a ⌘K shortcut.",
  ),
  links: copy(
    'Render items as anchors with `asChild`, so links open with a click, a middle-click, or Enter. ⌘+Enter or Ctrl+Enter opens the link in a new tab, like ⌘+click.',
  ),
  recent: copy('Store recently used commands and show them in their own group.'),
  toggleItems: copy(
    'Set `closeOnSelect={false}` and toggle values in `onSelect` to pick several items without closing.',
  ),
  footerActions: copy('Show shortcut hints or actions below the list with `Footer`.'),
  emptyState: copy('Customize what `Empty` shows when nothing matches.'),
  virtualized: copy(
    'Virtualize the list for large datasets. Pass a deferred copy of the query as `filterQuery` so typing stays responsive. Enter still runs the top match for what you typed.',
    `\`\`\`tsx
const [query, setQuery] = createSignal('');
const deferredQuery = createDeferred(query);
const command = useCommandCollection(() => ({
  initialItems,
  query: query(),
  onQueryChange: setQuery,
  filterQuery: deferredQuery(),
}));
\`\`\``,
  ),
  sizes: copy(
    '`size` on `Command.Root` sets the density. `size` on `Command.Dialog` sets the width.',
  ),
} as const;
