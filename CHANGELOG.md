# Changelog

All notable changes to `@leverui/components` are recorded here. The project
follows [Semantic Versioning](https://semver.org/). Prereleases are numbered
`-next.N` and may still include breaking changes.

## Unreleased

### Changed

- **Breaking:** CSS variables, classes, and data attributes use the short
  `lui` prefix instead of `leverui`. Rename them in your own CSS and code:

  | Before                | After             |
  | --------------------- | ----------------- |
  | `--leverui-colors-bg` | `--lui-colors-bg` |
  | `.leverui-button`     | `.lui-button`     |
  | `data-leverui-theme`  | `data-lui-theme`  |

  The default SkipNav target id is now `lui-skip-nav`. Layer names such as
  `leverui.recipes`, the `leverui-color-mode` storage key, and the package name
  are unchanged.

- `@leverui/components/styles.css` ships without whitespace or comments, which
  makes it about 16% smaller. Rules and values are unchanged.

### Fixed

- Every component now switches at the same widths. Some breakpoints were
  written in `rem` and others in pixels, so they drifted apart when the
  browser's font size was not 16px. All of them now use pixels.
- DatePicker and Command applied their `lg` styles from 992px. They now start
  at 1024px, like every other component.

## 1.0.0-next.0

First public alpha.

### Requirements

- Solid 2: `solid-js` and `@solidjs/web` peer range `>=2.0.0 <3`. See
  [Installation](https://leverui.com/docs/getting-started).
- Built on Zag `2.0.0-next.4` (exact prerelease pins).
- Props follow Solid 2's JSX types: lowercase attribute names, `class` arrays
  and objects, string ARIA booleans, and no `on:`, `attr:`, or `classList`.

### Added

- The user guides for this version in `dist/docs`, with an `llms.txt` index
  for AI coding agents.
- More than 100 SolidJS component families covering layout, typography, forms,
  overlays, navigation, feedback, disclosure, data display, and collections.
- Compound components with named parts, plus `as`, `asChild`, and the
  `render` prop for composition.
- Eight charts: area, bar, line, radar, radial bar, radial, scatter, and
  sparkline. Donut, pie, bar list, and bar segment charts are also included.
- Twelve hooks, including `useBreakpointValue`, `useDisclosure`,
  `useMediaQuery`, controlled-state helpers, and an overlay manager.
- Ready-made `Tooltip`, `ToggleTip`, `InfoTip`, and `Toaster` components, plus
  color mode helpers: `ColorModeScript`, `ColorModeButton`, `ColorModeIcon`,
  `LightMode`, `DarkMode`, `createColorMode`, and `getColorModeScript`.
- A `useChart` hook with series, aggregation, formatting, sorting, and
  highlighting helpers, plus axis and grid options for the cartesian charts.
- A `textStyle` prop on `Text`, `Span`, `Box`, and the layout components for the
  named text sizes.
- The `createContext` and `mergeProps` utilities.
- A default stylesheet at `@leverui/components/styles.css` with light and dark
  modes. Every component can be themed through public `--leverui-*` CSS
  variables and stable `leverui-<component>__<part>` classes. The stylesheet
  styles only Lever UI elements and has no page-wide reset or base styles.
- Server rendering and hydration through a Node.js build that the `node` export
  condition selects automatically.
- Guides for every component at
  [leverui.com](https://leverui.com/docs/getting-started).
