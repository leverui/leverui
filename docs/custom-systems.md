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
  --leverui-colors-bg: #f5f0ff;
  --leverui-colors-fg: #281c42;
  --leverui-colors-blue-solid: #6254c7;
  --leverui-colors-blue-contrast: white;
  --leverui-radii-l2: 0;
}

.brand-beta {
  --leverui-colors-bg: #161929;
  --leverui-colors-fg: #f7f7fb;
  --leverui-colors-blue-solid: #6e9bff;
  --leverui-colors-blue-contrast: #101322;
  --leverui-radii-l2: 16px;
}
```

Each Theme sets its light or dark scope, and its class sets local variables.
Components inside read the closest values. To change a section background, set
a semantic variable such as `--leverui-colors-bg`. Replacing a scale color
alone does not change it.

## Custom component appearances

Add a class for a look that is not a built-in variant. Write its interaction
states in your stylesheet.

```tsx
<Button class="brand-action">Continue</Button>
```

```css
.brand-action.leverui-button {
  background-color: var(--leverui-colors-purple-solid);
  color: var(--leverui-colors-purple-contrast);
}

.brand-action.leverui-button:is(:hover, [data-hover]) {
  background-color: color-mix(in srgb, var(--leverui-colors-purple-solid) 90%, transparent);
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
  --leverui-colors-blue-solid: #123456;
  --leverui-radii-l2: 0;
}

.theme-rounded {
  --leverui-colors-blue-solid: #a95500;
  --leverui-radii-l2: 16px;
}

.theme-sample {
  background-color: var(--leverui-colors-blue-solid);
}
```

Define keyframes in your own CSS. Use media or container queries for more
responsive choices.
