/** Website guide copy for each Listbox example, from the page. */
interface GuideParameters {
  readonly guide: { readonly description: string; readonly after?: string };
}

/** Pair a description with optional Markdown shown after the example. */
function copy(description: string, after?: string): GuideParameters {
  return { guide: { description, ...(after && { after }) } };
}

export const guide = {
  controlled: copy(
    'Control the listbox value externally using the `value` and `onValueChange` props for custom state management.',
  ),
  store: copy(
    'An alternative way to control the listbox is to use the `RootProvider` component and the `useListbox` store hook.',
    'This way you can access the listbox state and methods from outside the listbox.\n\n> Use `RootProvider + useListbox` or `Root`, not both.',
  ),
  disabledItem: copy(
    'Disable specific items in the listbox to indicate unavailable options while keeping them visible for context.',
  ),
  grouped: copy(
    'Use item groups to organize related options with clear section headers, making it easier for users to find specific categories of items.',
  ),
  horizontal: copy(
    'Display listbox items in a horizontal layout with card-based presentation, perfect for media galleries or visual selection interfaces.',
  ),
  multiselect: copy(
    'Enable users to select multiple items from the list, useful for scenarios like choosing tags, categories, or preferences.',
  ),
  selectAll: copy(
    'Provide convenient "Select All" and "Select None" controls for multiple selection scenarios, with visual indicators showing selection state.',
  ),
  extendedSelect: copy(
    'Use extended selection mode to allow users to select multiple items using keyboard shortcuts like Cmd/Ctrl for advanced selection patterns.',
  ),
  checkmark: copy(
    'Display custom checkmarks for multiple selection scenarios, providing clear visual feedback for selected items.',
  ),
  icon: copy(
    'Add icons to listbox items to provide visual context and improve recognition of different options.',
  ),
  description: copy(
    'Include additional descriptive text for each item to provide more context and help users make informed choices.',
  ),
  input: copy(
    'Combine a search input with the listbox to filter options dynamically, making it easy to find specific items in long lists.',
  ),
  keyboardPriority: copy(
    'Set `keyboardPriority="navigate"` on `Listbox.Input` so Home and End move the highlighted item instead of the text caret. The default `caret` mode preserves native text editing behavior.',
  ),
  popover: copy(
    'Use the listbox within a popover to create dropdown-like selection menus that overlay other content without taking up permanent screen space.',
  ),
  dialog: copy(
    'Present the listbox in a modal dialog for focused selection experiences, particularly useful for important choices that need user attention.',
  ),
  virtualized: copy(
    'Handle large datasets efficiently with virtualization, rendering only visible items to maintain smooth scrolling performance even with thousands of items.',
  ),
  imageExplorer: copy(
    'Create an interactive gallery where the listbox acts as navigation for displaying different images or media content.',
  ),
  transferList: copy(
    'Create a dual-listbox interface for moving items between available and selected states, commonly used for permission management or item selection workflows.',
  ),
  emojiGrid: copy(
    'Display emojis in a grid layout with filtering capability, perfect for emoji pickers or icon selection interfaces.',
  ),
};
