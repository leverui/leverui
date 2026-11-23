# Lever UI theming

Lever UI ships its default presentation in authored CSS. Import the package
stylesheet once, then import application CSS for token and component overrides:

```tsx
import '@leverui/components/styles.css';
import './theme.css';
import { Button } from '@leverui/components';

<Button colorPalette="blue">Save</Button>;
```

Components use their documented props, native `class` and `style`, public CSS
variables, and stable part classes.
See the [consumer theme guide](theme-guide.md) for a complete example.

## Public variable contract

Foundation tokens use `--lui-*` names. A token such as
`--lui-colors-blue-500` can be overridden at the root; semantic roles such
as `--lui-colors-bg` describe how components use those values. Import your
CSS after the package stylesheet:

```css
:root {
  --lui-colors-blue-500: #6254c7;
  --lui-fonts-body: 'Inter', sans-serif;
  --lui-radii-md: 0.75rem;
}
```

The [generated variable reference](theme-variables/README.md) lists values
directly from the authored stylesheet, including mode defaults and source
files. Public variables are customization hooks. Names beginning
`--lui-private-*` are implementation details.

Palette roles such as `--lui-colors-blue-solid`,
`--lui-colors-blue-contrast`, and `--lui-colors-blue-focus-ring` can
be changed independently. A component's `colorPalette` choice selects the
corresponding palette through authored CSS. An enclosing `Theme` can set
`colorPalette` for descendants that inherit that choice. The
[palette alias reference](theme-variables/colors.md#palette-aliases) lists aliases
currently emitted by the stylesheet.

## Color modes and nested scopes

The root color mode uses `data-leverui-color-mode="light"` or `"dark"` on
`html`. Light is the default when no mode is specified. When the initial mode
is known on the server, render that attribute in server HTML so the first
paint and hydration agree.

`Theme` creates a nested semantic color scope. It accepts native attributes,
`class`, `style`, `colorPalette`, and `appearance="light"` or `"dark"`:

```tsx
import { Button, Theme } from '@leverui/components';

<Theme appearance="dark" class="editor-panel">
  <Button colorPalette="blue">Save</Button>
</Theme>;
```

```css
.editor-panel {
  --lui-colors-bg: #10111a;
  --lui-colors-fg: #f7f7fb;
  --lui-colors-blue-solid: #6e9bff;
}
```

An explicit appearance establishes that mode's semantic defaults. A `Theme`
without `appearance` inherits the nearest mode and its semantic values. Set a
semantic variable directly on a nested scope when changing its role value;
changing only a foundation variable there does not recalculate an inherited
semantic value. `hasBackground={false}` leaves the Theme element transparent.
The mode selectors use CSS `@scope`, so nested light and dark scopes require
browser support for that feature.

Portalled content leaves its original DOM ancestry. Wrap the content in an
explicit `Theme` with the desired appearance and class when it needs the same
semantic values. See [scoped CSS themes](custom-systems.md) for examples.

## Component hooks and cascade

The stylesheet uses named layers in this order:

```css
@layer leverui.reset, leverui.base, leverui.tokens, leverui.recipes, leverui.utilities;
```

The stylesheet has no page-wide rules. It does not reset, color, or set fonts on
`html`, `body`, or your own elements. The `reset` layer applies only to elements
with a `leverui-` class. Layout and typography primitives such as `Box`, `Text`,
and `Stack` inherit font, color, and line height from their surroundings. Every
other component sets the theme font, text color, and line height on its
outermost element, and the parts inside it inherit them. Your page keeps its own
styles. Global tag rules
in your CSS, such as `button { … }`, are unlayered, so they also reach Lever UI
elements of that tag. Scope such rules with a class when they should not.

The `recipes` layer name groups authored component rules; it does not imply a
runtime recipe API. The `utilities` layer holds the named `textStyle` presets,
which take precedence over component rules. Ordinary unlayered application CSS takes precedence over
normal library declarations. Use component and part classes, data attributes,
and public variables from each [component guide](components/README.md). Avoid
`!important` for ordinary overrides.

Use finite component props for documented sizes, variants, and states. Add an
application class and CSS rules for other treatments. Ordinary media and
container queries cover responsive choices; see [responsive styles](responsive-styles.md).

## Server rendering

The package stylesheet supplies defaults before JavaScript runs. Render the
same Solid component tree on the server and client, include the stylesheet in
the client build, and hydrate the server markup. No provider style cache or
runtime presentation tags are required. See [server rendering](server-rendering.md)
for the application setup and [theme guide](theme-guide.md) for override order.
