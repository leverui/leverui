# Lever UI for SolidJS

Lever UI is an accessible component library for SolidJS 2. It ships with a
default CSS theme and supports server rendering and hydration.

> **Alpha:** `1.0.0-next.0` is the first public release. APIs may still change
> before 1.0.

## Install

```sh
pnpm add @leverui/components@next solid-js @solidjs/web
```

Lever UI requires `solid-js` and `@solidjs/web` `2.0.0` or later.

## Use

Import the stylesheet once in your application entry, then import components
from the package root:

```tsx
import '@leverui/components/styles.css';
import { Button } from '@leverui/components';

/** Render an action using the default theme. */
function App() {
  return <Button colorPalette="blue">Continue</Button>;
}
```

Compile with a SolidJS 2 toolchain such as `@solidjs/vite-plugin`, with
`jsxImportSource` set to `@solidjs/web`. The
[installation guide](https://leverui.com/docs/getting-started) covers the TypeScript settings.

## Documentation

The full documentation is at [leverui.com](https://leverui.com).

- **Get started:** [Installation](https://leverui.com/docs/getting-started),
  [Server rendering](https://leverui.com/docs/server-rendering),
  [Accessibility](https://leverui.com/docs/accessibility)
- **[Components](https://leverui.com/docs/components/concepts/overview):**
  examples and props for every component, hook, and utility.
- **[Charts](https://leverui.com/docs/charts):** area, bar, line, pie, and
  other charts.
- **Theming:** [Customize with CSS](https://leverui.com/docs/theme-guide),
  [Colors](https://leverui.com/docs/colors),
  [Responsive styles](https://leverui.com/docs/responsive-styles),
  [Scoped themes](https://leverui.com/docs/custom-systems),
  [CSS variables](https://leverui.com/docs/theme-variables)

### For AI coding agents

The package includes the guides for its own version, with an index at
`node_modules/@leverui/components/dist/docs/llms.txt`. See
[AI coding agents](https://leverui.com/docs/ai-agents). Add this line to your
`AGENTS.md` or `CLAUDE.md`:

```text
Before using Lever UI, read node_modules/@leverui/components/dist/docs/llms.txt
and open the guide for each component you use.
```

## Release notes

See the [changelog](CHANGELOG.md).

## License

MIT. Lever UI adapts designs and code from other open-source projects; see
[third-party licenses](THIRD_PARTY_LICENSES).
