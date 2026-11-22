# Icon

Sizes and colors an SVG icon to match the text around it.

```tsx
import { Icon } from '@leverui/components';
```

```tsx
<Icon />
```

> Lever UI ships no icons. Use an icon package built for Solid 2, such as
> [`@lucide/solid`](https://lucide.dev/guide/packages/lucide-solid), which the
> examples use.

Lucide icons are 24px unless you pass `size`. To match the text size instead,
add this rule once. An icon with its own `size` keeps it. Components that size
their own icons, such as `Button`, still do.

```css
@layer leverui.base {
  :where(.lucide[width='24'][height='24']) {
    width: 1em;
    height: 1em;
  }
}
```

To size and color an icon component, render `Icon` as a `span` around it. The
icon fills the span.

```tsx
<Icon as="span" size="lg" class="muted-icon">
  <PackageIcon />
</Icon>
```

## Guides

### Accessibility

Default: `focusable="false"` and `aria-hidden="true"`, so screen readers skip
it. For an icon that carries meaning on its own, give it a name and unhide it.

```tsx
<Icon role="img" aria-label="Saved" aria-hidden="false" viewBox="0 0 24 24">
  <path d="M4 12l5 5 11-11" fill="none" stroke="currentColor" />
</Icon>
```

### Sizes and styling

`size` values: `inherit`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Default:
`inherit`. A native Icon gets `width="1em"` and `height="1em"`, so a parent can
size it. Named sizes are 12, 16, 20, 24, 28, and 32 pixels in the default
theme. `size` is never passed as a native `size` attribute. Responsive: pass an
object keyed by breakpoint or an array.

Import `@leverui/components/styles.css` once. Restyle with `class` or `style`,
target `.leverui-icon`, or set `--leverui-icon-size` on a named size. No
`!important` needed. The SVG `color` attribute takes a CSS color, not a token
name such as `red.500`. Use `var(--leverui-colors-red-500)` in CSS.

`IconPropsProvider` sets a default size, class, and native attributes for the
icons inside it. The defaults can be reactive. Each Icon keeps its own element,
`ref`, and `asChild` renderer. An `unstyled` Icon keeps its element and class
but gets no default width or height.

To share SVG shapes through `IconPropsProvider`, pass `children` as a function.
It is called once per Icon. Return new nodes on every call.

```tsx
function renderSharedPath() {
  return <path d="M3 3h18v18H3z" />;
}

<IconPropsProvider value={{ children: renderSharedPath }}>
  <Icon />
  <Icon />
</IconPropsProvider>;
```

### Custom SVG components

`asChild` puts the Icon styles and attributes on your own SVG. Call `getProps`
and spread the result on it.

```tsx
import { Icon, type IconProps } from '@leverui/components';

type GetIconChildProps = Parameters<NonNullable<IconProps<'svg'>['asChild']>>[0];

function renderCustomSvg(getProps: GetIconChildProps) {
  return (
    <svg {...getProps()} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="10" fill="currentColor" />
    </svg>
  );
}

<Icon size="lg" class="app-blue-icon" asChild={renderCustomSvg} />;
```

Pass `as` for a different native tag. `ref` then receives that element. Prefer
`asChild` for a custom SVG: it keeps the `viewBox` and paths together.

### Reusable icons

`createIcon` makes an icon component. Give it `d`, the data for a single path,
or `path`, a function that renders the SVG shapes. `path` must be a function,
not a JSX element. If `path` returns nothing, `createIcon` falls back to `d`,
if set.

```tsx
import { createIcon } from '@leverui/components';

function renderRings() {
  return (
    <>
      <circle cx="12" cy="16" r="8" />
      <circle cx="20" cy="16" r="8" />
    </>
  );
}

const CheckIcon = createIcon({ d: 'M4 12l5 5 11-11' });
const RingsIcon = createIcon({
  displayName: 'RingsIcon',
  viewBox: '0 0 32 32',
  path: renderRings,
  defaultProps: { size: 'sm' },
});

<CheckIcon size="lg" />;
<RingsIcon size="xl" />;
```

Props on an icon override the `viewBox` and `defaultProps` given to
`createIcon`. Default `viewBox`: `0 0 24 24`.
