# Tabs

Splits content into panels and shows one at a time, picked from a row of tabs.

```tsx
import { Tabs } from '@leverui/components';
```

```tsx
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger />
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content />
</Tabs.Root>
```

## Guide

### Styling active tab

The active tab has a `data-selected` attribute.

```tsx
<Tabs.Trigger class="active-blue" value="members">
  Tab
</Tabs.Trigger>
```

```css
.active-blue[data-selected] {
  background: var(--lui-colors-blue-500);
  color: white;
}
```

## Props

### Root

| Prop             | Default      | Type                                                                                                     | Description                                                                     |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `activationMode` | `automatic`  | `'manual' \| 'automatic'`                                                                                | `automatic` selects a tab on focus. `manual` selects on click or Enter.         |
| `loopFocus`      | `true`       | `boolean`                                                                                                | Wrap keyboard focus from the last tab to the first.                             |
| `orientation`    | `horizontal` | `'horizontal' \| 'vertical'`                                                                             | Tabs in a row or a column. The arrow keys follow.                               |
| `colorPalette`   | `gray`       | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                                                  |
| `size`           | `md`         | `'sm' \| 'md' \| 'lg'`                                                                                   | Tabs size. Responsive.                                                          |
| `variant`        | `line`       | `'line' \| 'subtle' \| 'enclosed' \| 'outline' \| 'plain'`                                               | Tabs style. Responsive.                                                         |
| `as`             | `div`        | Native HTML tag                                                                                          | HTML tag to render.                                                             |
| `asChild`        | —            | Solid render function                                                                                    | Render your own element with the root's props.                                  |
| `unstyled`       | `false`      | `boolean`                                                                                                | Turn off the default styles.                                                    |
| `virtualFocus`   | `false`      | `boolean`                                                                                                | Keep browser focus off the triggers. Arrow keys move the focused value instead. |
| `defaultValue`   | —            | `string`                                                                                                 | Tab selected at first.                                                          |
| `deselectable`   | —            | `boolean`                                                                                                | Let a click on the active tab deselect it.                                      |
| `id`             | —            | `string`                                                                                                 | Unique id for the tabs' state machine.                                          |
| `ids`            | —            | Element ID map                                                                                           | Ids of the tab elements.                                                        |
| `lazyMount`      | `false`      | `boolean`                                                                                                | Render a panel only once its tab is first selected.                             |
| `navigate`       | —            | `(details: NavigateDetails) => void`                                                                     | Called to go to the selected tab when the triggers are links.                   |
| `onFocusChange`  | —            | `(details: FocusChangeDetails) => void`                                                                  | Called when the focused tab changes.                                            |
| `onValueChange`  | —            | `(details: ValueChangeDetails) => void`                                                                  | Called when the selected tab changes.                                           |
| `translations`   | —            | `IntlTranslations`                                                                                       | Translated strings for the accessibility elements.                              |
| `unmountOnExit`  | `false`      | `boolean`                                                                                                | Remove a panel from the page when its tab is deselected.                        |
| `value`          | —            | `string`                                                                                                 | Selected tab. Controlled.                                                       |
| `fitted`         | —            | `boolean`                                                                                                | Stretch the tabs to fill their container. Responsive.                           |
| `justify`        | —            | `'start' \| 'center' \| 'end'`                                                                           | Where the tabs line up in the list. Responsive.                                 |

### Trigger

| Prop      | Default  | Type                  | Description                                       |
| --------- | -------- | --------------------- | ------------------------------------------------- |
| `as`      | `button` | Native HTML tag       | HTML tag to render.                               |
| `asChild` | —        | Solid render function | Render your own element with the trigger's props. |

### Content

| Prop      | Default | Type                  | Description                                     |
| --------- | ------- | --------------------- | ----------------------------------------------- |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.                             |
| `asChild` | —       | Solid render function | Render your own element with the panel's props. |

Each trigger `value` must match the `value` of one content panel. Give each tab
list a label. Keep keyboard directions consistent with the orientation. With
`activationMode="manual"`, focus moves first and the tab is selected
afterwards, which helps when a panel is slow to load.

`size`, `variant`, `fitted`, and `justify` also take an object, or an array
with gaps, that sets a value at the `base`, `sm`, `md`, `lg`, `xl`, and `2xl`
breakpoints. They are applied with CSS, so they work on a static page.
Examples: `size={{ base: 'sm', md: 'lg' }}`,
`fitted={{ base: true, md: false }}`. Without `base`, the tabs start from the
default.

## Customize with CSS

Override the `--lui-*` theme variables, such as
`--lui-tabs-indicator-bg`, `--lui-tabs-indicator-shadow`, and
`--lui-tabs-trigger-radius`, or style the `.leverui-tabs__*` part classes.
Every part accepts `class` and `style`. `unstyled` on the root or a single part
turns off its default styles.

## Explorer

Click a part name to highlight it in the preview.
