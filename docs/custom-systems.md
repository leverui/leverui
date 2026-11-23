# Scoped CSS themes

Import the package stylesheet once, before your own CSS.

```tsx
import '@leverui/components/styles.css';
import './theme.css';
import { Button, Theme } from '@leverui/components';

<>
  <Theme appearance="light" class="brand-alpha">
    <Button colorPalette="blue">Alpha</Button>
  </Theme>
  <Theme appearance="dark" class="brand-beta">
    <Button colorPalette="blue">Beta</Button>
  </Theme>
</>;
```

```css
.brand-alpha {
  --lui-colors-bg: #f5f0ff;
  --lui-colors-fg: #281c42;
  --lui-colors-blue-solid: #6254c7;
  --lui-colors-blue-contrast: white;
  --lui-radii-l2: 0;
}

.brand-beta {
  --lui-colors-bg: #161929;
  --lui-colors-fg: #f7f7fb;
  --lui-colors-blue-solid: #6e9bff;
  --lui-colors-blue-contrast: #101322;
  --lui-radii-l2: 16px;
}
```

Each Theme sets its light or dark scope, and its class sets local variables.
Components inside read the closest values. To change a section background, set
a semantic variable such as `--lui-colors-bg`. Replacing a scale color
alone does not change it.

## Custom component appearances

Add a class for a look that is not a built-in variant. Write its interaction
states in your stylesheet.

```tsx
<Button class="brand-action">Continue</Button>
```

```css
.brand-action.leverui-button {
  background-color: var(--lui-colors-purple-solid);
  color: var(--lui-colors-purple-contrast);
}

.brand-action.leverui-button:is(:hover, [data-hover]) {
  background-color: color-mix(in srgb, var(--lui-colors-purple-solid) 90%, transparent);
}
```

Unlayered CSS overrides Lever UI's component layer without `!important`. Use
the component and part classes, state attributes, and variables listed in each
component guide.

## Portals

A portal moves its children outside the scoped ancestor. Give portalled content
the same class and an explicit color mode to share the theme.

```tsx
import { Button, Portal, Theme } from '@leverui/components';

<Portal>
  <Theme appearance="light" class="brand-alpha">
    <Button colorPalette="blue">Portalled</Button>
  </Theme>
</Portal>;
```

## Reactive theme changes

Change a wrapper class with a signal. Descendants update without remounting.

```tsx
import { createSignal, type JSX } from 'solid-js';
import { Box, Button } from '@leverui/components';

/** Switch two local CSS themes while preserving the mounted children. */
export function ReactiveThemeExample(): JSX.Element {
  const [rounded, setRounded] = createSignal(false);

  /** Toggle the wrapper class that supplies local design variables. */
  function toggleTheme(): void {
    setRounded(!rounded());
  }

  return (
    <div class={rounded() ? 'theme-rounded' : 'theme-compact'}>
      <Box class="theme-sample">Token sample</Box>
      <Button colorPalette="blue" onClick={toggleTheme}>
        Switch theme
      </Button>
    </div>
  );
}
```

```css
.theme-compact {
  --lui-colors-blue-solid: #123456;
  --lui-radii-l2: 0;
}

.theme-rounded {
  --lui-colors-blue-solid: #a95500;
  --lui-radii-l2: 16px;
}

.theme-sample {
  background-color: var(--lui-colors-blue-solid);
}
```

Define keyframes in your own CSS. Use media or container queries for more
responsive choices.
