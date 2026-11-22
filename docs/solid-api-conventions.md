# Solid API conventions

These are the cross-component rules for Lever UI's SolidJS APIs. Each
family's [component guide](components/README.md) lists its own API and parts.

## Components and children

- Use SolidJS functions and reactive getters for component props. Do not read
  changing props once into an untracked variable.
- Render children through Solid's JSX contract. Keep children lazy where
  component state or presence controls whether a part is mounted.
- `ClientOnly` accepts direct Solid JSX or a zero-argument render function.
  Use a render function for content that reads browser APIs while being
  constructed: `<ClientOnly fallback={<>Loading</>}>{() => window.location.pathname}</ClientOnly>`.
  The fallback renders on the server and through hydration; the function runs
  only after mount. Direct JSX may evaluate browser expressions earlier.
- `For` accepts a readonly array or `undefined`, a fallback, and a typed item
  render function. It uses Solid's keyed list rendering, so the second render
  argument is an `Accessor<number>`. Read `index()` in JSX to track reordering;
  item DOM nodes are reused when their object identities remain stable. Empty
  arrays show the fallback; `undefined` renders nothing. Sparse holes are
  skipped while present items keep their original indexes. No wrapper is
  added. Example:
  `<For each={items()} fallback={<p>No items</p>}>{(item, index) => <li>{index()}: {item.label}</li>}</For>`.
- `Show` follows Solid's truthy condition and fallback behavior without a DOM
  wrapper. Its render function receives an `Accessor<NonNullable<T>>`. Call
  the accessor in JSX to follow a changing truthy value while keeping the
  mounted branch. Use a render function when constructing the child must wait
  until the condition is truthy.
- `VisuallyHidden` renders a native `span` with authored CSS by default. Its
  `asChild` takes a `getProps` render function:
  `<VisuallyHidden asChild={(getProps) => <input {...getProps()} />} />`.
  The function applies the hidden styles and forwarded attributes to the
  child's native element without adding a span.
- `LocaleProvider` shares a reactive locale with its descendants.
  `useLocaleContext()` returns a Solid accessor for `{ locale, dir }`, and
  `useFilter(props)` returns an accessor for the locale-aware matchers. Read
  each accessor inside tracked JSX to follow provider changes. A nested
  provider overrides its ancestor; an explicit filter locale overrides both.
- Keep compound parts and context as Lever UI exports. Wrap the internal
  primitives in `src/primitives/` with Lever UI styles and props; do not
  expose them as the public component API.

## Polymorphism and refs

- `asChild` takes a render function:
  `asChild={(getProps) => <a {...getProps()} />}`. Use it for primitive-backed
  parts and Lever UI elements such as `Theme`. `getProps(childProps?)` combines
  parent and child classes, styles, event handlers, attributes, and functional
  refs before spreading them onto the child. Child event handlers run before
  parent handlers.
- Primitive-backed parts also accept `render={(getProps, state) => ...}`. It
  takes the same props function plus the part's state accessor, typed
  `unknown`. Use one of `as`, `asChild`, or `render` per part; combining them
  is a type error. Refs are not forwarded through `render`, so put the `ref`
  on the rendered element.
- Use Solid's native `ref` contract. Verify the actual element type for every
  part, including polymorphic rendering.
- `TextPropsProvider` supplies style, recipe, and native attribute defaults.
  Set `as`, `asChild`, and `ref` on each `Text` instance so its ref type matches
  the element that actually renders.
- `HeadingPropsProvider` shares style and native defaults; set `as`, `asChild`,
  and `ref` per Heading so refs match elements. See [Heading](components/heading.md).
- `Group` and `ButtonGroup` take
  `skip={(element: HTMLElement | SVGElement | MathMLElement) => ...}`. Solid
  supplies the rendered native element after mount. For server-rendered
  groups, set `data-leverui-group-skip` on a child that must be excluded from
  the joined edge and stacking calculation. Example:
  `<Group skip={(element) => element.getAttribute('data-separator') === 'true'}>...</Group>`.
- Both groups use `--leverui-group-gap` for spacing and write
  `--leverui-group-count` and `--leverui-group-index` on included children.
  An inline value supplied by a child takes precedence over its generated
  count or index.
- Before hydration, both groups use authored CSS sibling rules to preserve the
  stacking order. Hydration supplies exact group indices for rendered children.
- `Image` maps `fit` and `align` to CSS `object-fit` and `object-position`.
  `htmlWidth` and `htmlHeight` set native attributes independently of CSS
  dimensions. Native `width`, `height`, `class`, and `style` remain available.
  Its `asChild` render function wraps a third-party image component or a
  native `<img>`.
- `SimpleGrid` maps responsive `columns` and `minChildWidth` to Grid tracks.
  Minimum widths use size tokens or CSS lengths; numeric values fall back to
  pixels. Native `as` and the render-function `asChild` follow Grid.
- `SpinnerPropsProvider` supplies default native and component choice props.
  Each Spinner instance owns `as`, `asChild`, and `ref` so its native ref type
  matches the rendered element. A custom indicator uses
  `asChild={(getProps) => <span {...getProps()}>...</span>}`.
  Provider and instance event functions compose in that order for `onClick`.
  A direct listener options object keeps Solid's native options; an instance
  object replaces a provider event value because separate `capture`, `once`,
  or `passive` options cannot be merged into one native listener without
  changing their behavior.
- `Input` renders the field primitive's input through a Lever UI styled native
  element. Inside a field it receives IDs, required and invalid state, and
  descriptions; outside a field it keeps ordinary native input behavior.
  `InputPropsProvider` supplies reactive defaults without choosing the element
  or ref. Solid's `onInput` receives the native event; an instance handler runs
  after a provider handler. `value` is controlled when updated from a signal.
  `defaultValue` initializes an uncontrolled input once and is not reapplied
  when recipe or provider props change.
- `CheckboxRoot` renders a native label and the checkbox state machine with
  Lever UI slot styles. A Solid signal supplies `checked`; `onCheckedChange`
  delivers `{ checked }`. Lever UI invokes the controlled callback in a
  microtask after the machine's transition so a synchronous signal write
  updates the root, control, indicator, and hidden input together.
  Uncontrolled callbacks stay synchronous. `CheckboxPropsProvider` supplies
  reactive recipe defaults. A custom `CheckboxIndicator` mark uses a render
  function: `checked={(getProps) => <svg {...getProps()}>...</svg>}`. This lets
  the supplied SVG receive state, recipe classes, style, and refs while it is
  active. The same form applies to `indeterminate`.
- `DialogRoot` owns open state, focus, presence, and generated IDs. A Solid
  signal can control `open` through `onOpenChange`'s `{ open }` details. Root
  defaults to lazy mounting and unmounting on exit. Dialog parts insert their
  slot styles where they render. Lever UI's `<Portal>` renders children inline
  on the server and through the first hydration pass, then moves them outside
  the trigger's DOM ancestry while preserving Dialog context and styles.
  Solid's native Portal omits its children from server HTML, which would lose
  initially open Dialog content.
- The public Spinner track hook is `--leverui-spinner-track-color`. The size
  variable is internal and uses `--leverui-private-spinner-size`.
- `Loader` takes reactive Solid children. An absent `spinner` uses the default
  `Spinner`; `spinner={null}` omits it. `visible={false}` returns the original
  children without a wrapper, so a Loader ref has no element in that state.
  `spinnerPlacement="end"` places the indicator after `text`. `LoaderOverlay`
  renders a styled native div by default; both components accept typed native
  `as` and the render-function `asChild` prop.
- Preserve native HTML attributes and semantic defaults. Style props must be
  consumed by Lever UI and must not leak as invalid DOM attributes.

## State and events

- Interactive components offer controlled and uncontrolled APIs. Pass
  changing values reactively so the state machine receives updates.
- Use signals and memos for Lever UI-owned state and derived values. Effects are
  for external side effects, not ordinary render calculations.
- Preserve callback ordering, cancelation, disabled behavior, and native form
  behavior when combining Lever UI props with primitive-provided props.
- `TabsRoot` exposes controlled `value` and uncontrolled `defaultValue` props.
  The state machine owns keyboard movement, focus, IDs, selection, and panel
  presence. `onValueChange` receives `{ value }`; read a Solid signal directly
  in the root props and write the new value in that callback. A
  `TabsPropsProvider` supplies reactive defaults; each `TabsRoot` creates its
  own machine. `lazyMount` delays a panel's first mount; add `unmountOnExit`
  when inactive panels should leave the DOM.

## Context, portals, and server rendering

- Use Solid context for theme and family state. Scope style collection and
  mutable IDs to a render or provider; avoid shared server globals.
- `Presence` uses the presence state machine for entry, exit, lazy mounting,
  and unmount-on-exit timing. Lever UI renders the hidden and `data-state`
  values on a native element, so application CSS can target its states. A
  Solid signal controls `present`; the optional animation and render-strategy
  props pass through. Server output is visible, hidden, or absent according to
  the initial state and `lazyMount`.
- `EnvironmentProvider` shares the DOM root context so stateful components and
  Lever UI's `Portal` resolve the same document or shadow root.
  `useEnvironmentContext()` returns a Solid accessor; call `environment()`
  inside reactive code to read `getRootNode`, `getDocument`, or `getWindow`.
  Without an explicit root, a hidden marker locates the nearest DOM root after
  mount. An explicit `value` can be a root or a function that reads a signal.
  `Portal` uses the nearest shadow root or owning document body unless `mount`
  is supplied; it still renders inline on the server and through hydration.
  `container` takes an element or an accessor, and a changing accessor updates
  the mount. `mount` is the native Solid destination prop and takes priority
  if both are supplied. Solid's portal container keeps delegated events
  attached to the original Solid owner, so browser content has one inert
  wrapper at its destination. Lever UI sets that wrapper to
  `display: contents` so its children participate directly in flex and grid
  layout.
- Import `@leverui/components/styles.css` once for authored defaults. Use native
  `class` and `style`, stable part selectors, and public `--leverui-*` variables
  for application styling.
- Let the state machines manage focus, presence, keyboard, and portal behavior.
  Add Lever UI behavior only for a documented gap.
- Verify server output and hydration for each family, including conditional
  mounting, portals, generated IDs, and responsive styles.
