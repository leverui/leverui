/** Website guide copy for each Combobox example, from the page. */
interface GuideParameters {
  readonly guide: { readonly description: string; readonly after?: string };
}

/** Pair a description with optional Markdown shown after the example. */
function copy(description: string, after?: string): GuideParameters {
  return { guide: { description, ...(after && { after }) } };
}

export const guide = {
  basic: copy('The basic combobox provides a searchable dropdown with single selection.'),
  sizes: copy('Pass the `size` prop to the `Combobox.Root` to change the size of the combobox.'),
  variants: copy(
    'Pass the `variant` prop to the `Combobox.Root` to change the appearance of the combobox.',
  ),
  multiple: copy(
    'Pass the `multiple` prop to the `Combobox.Root` to enable multiple selection. This allows users to select multiple items from the list.',
    '> When this is set, the combobox will always clear the input value when an item is selected.',
  ),
  async: copy(
    "Here's an example of loading the `collection` asynchronously as users type, perfect for API-driven search interfaces.",
  ),
  highlight: copy(
    "Here's an example of composing the `Combobox.Item` and `Highlight` components to highlight matching text in search results.",
  ),
  openOnClick: copy(
    'Use the `openOnClick` prop to open the combobox when the user clicks on the input.',
  ),
  customObject: copy(
    'By default, the combobox collection expects an array of objects with `label` and `value` properties. In some cases, you may need to deal with custom objects.',
    `Use the \`itemToString\` and \`itemToValue\` props to map the custom object to the required interface.

\`\`\`tsx
const items = [
  { country: 'United States', code: 'US', flag: '🇺🇸' },
  { country: 'Canada', code: 'CA', flag: '🇨🇦' },
  { country: 'Australia', code: 'AU', flag: '🇦🇺' },
  // ...
];

const matcher = useFilter({ sensitivity: 'base' });

const { collection } = useListCollection({
  initialItems: items,
  itemToString: (item) => item.country,
  itemToValue: (item) => item.code,
  filter: (text, query) => matcher().contains(text, query),
});
\`\`\``,
  ),
  minCharacter: copy(
    'Use the `openOnChange` prop to set a minimum number of characters before filtering the list.',
    '```tsx\n<Combobox.Root openOnChange={(details) => details.inputValue.length > 2} />\n```',
  ),
  field: copy(
    'Compose the `Combobox` component with the `Field` component to wrap the combobox in a form field. Useful for form layouts.',
  ),
  formSubmit: copy(
    'When working with custom objects in forms, you often need to submit the programmatic value rather than the display value. This example shows how to combine custom object mapping with form submission using a hidden input.',
    `The key is using \`itemToValue\` to define what gets submitted, while \`itemToString\` controls what users see. A hidden input captures the programmatic value for form submission.

> In this example, users see "🇺🇸 United States" but the form submits "US".`,
  ),
  hookForm: copy(
    "This example demonstrates how to integrate the Combobox with a form, holding the value in a Solid signal. The form automatically receives the item's `value` property without needing a hidden input.",
    'Users see "React" but the form receives "react".',
  ),
  disabled: copy('Pass the `disabled` prop to the `Combobox.Root` to disable the entire combobox.'),
  disabledItem: copy(
    'Disable specific items in the dropdown, add the `disabled` prop to the collection item.',
    `\`\`\`tsx
const items = [
  { label: 'Item 1', value: 'item-1', disabled: true },
  { label: 'Item 2', value: 'item-2' },
];

const { collection } = useListCollection({
  initialItems: items,
  // ...
});
\`\`\``,
  ),
  inputGroup: copy('Combine with InputGroup to add icons or other elements.'),
  invalid: copy('Pass the `invalid` prop to the `Combobox.Root` to show the error state.'),
  controlled: copy(
    "Use the `value` and `onValueChange` props to control the combobox's value programmatically.",
  ),
  store: copy(
    'An alternative way to control the combobox is to use the `Combobox.RootProvider` component and the `useCombobox` store hook.',
    `\`\`\`tsx
import { Combobox, useCombobox } from '@leverui/components';

/** Pass a caller-owned machine to the provider. */
function Demo() {
  const combobox = useCombobox();

  return <Combobox.RootProvider value={combobox}>{/* ... */}</Combobox.RootProvider>;
}
\`\`\`

This way you can access the combobox state and methods from outside the combobox.`,
  ),
  openControlled: copy(
    "Use the `open` and `onOpenChange` props to control the combobox's open state programmatically.",
  ),
  limit: copy(
    'The recommended way of managing large lists is to use the `limit` property on the `useListCollection` hook. This will limit the number of rendered items in the DOM to improve performance.',
  ),
  virtualized: copy(
    'Alternatively, you can virtualize large datasets with TanStack Virtual. Its Solid adapter targets Solid 1, so the example uses a small Solid 2 binding over `@tanstack/virtual-core`.',
  ),
  links: copy(
    'Use the `asChild` prop to render the combobox items as links.',
    `For custom router links, you can customize the \`navigate\` prop on the \`Combobox.Root\` component.

Here's an example of using Solid Router.

\`\`\`tsx
import { Combobox } from '@leverui/components';
import { useNavigate } from '@solidjs/router';

/** Route selected links through the application router. */
function Demo() {
  const navigate = useNavigate();
  return (
    <Combobox.Root
      navigate={({ href }) => {
        navigate(href);
      }}
    >
      {/* ... */}
    </Combobox.Root>
  );
}
\`\`\``,
  ),
  rehydrate: copy(
    "In some cases, where a combobox has a `defaultValue` but the collection is not loaded yet, here's an example of how to rehydrate the value and populate the input value.",
  ),
  customItem: copy('Customize the appearance of items in the dropdown with your own components.'),
  customFilter: copy(
    "Here's an example of a custom filter that matches multiple properties of an item.",
  ),
  customAnimation: copy(
    'To customize the animation of the combobox, set the `--lui-combobox-content-open-animation` and `--lui-combobox-content-closed-animation` variables on the `Combobox.Content` component.',
  ),
  openFromPopover: copy(
    'To use the combobox within a dialog or popover component, avoid wrapping the `Combobox.Positioner` within the `Portal`.',
    `\`\`\`diff
-<Portal>
  <Combobox.Positioner>
    <Combobox.Content>
      <Combobox.List>
        {/* ... */}
      </Combobox.List>
    </Combobox.Content>
  </Combobox.Positioner>
-</Portal>
\`\`\`

If you use a \`Dialog\` and have set \`scrollBehavior="inside"\`, you need to:

- Set the combobox positioning to \`fixed\` to avoid the combobox from being clipped by the dialog.
- Set \`hideWhenDetached\` to \`true\` to hide the combobox when the trigger is scrolled out of view.

\`\`\`tsx
<Combobox.Root positioning={{ strategy: 'fixed', hideWhenDetached: true }}>
  {/* ... */}
</Combobox.Root>
\`\`\``,
  ),
  creatable: copy(
    "Here's an example of how to allow users to create new options by typing values that don't exist in the list. It uses the `useCombobox` and `Combobox.RootProvider` components for smoother integration and management.",
    '> **Note:** This example is not fully tested. Feel free to use it as a starting point and improve it according to your needs.',
  ),
} as const;
