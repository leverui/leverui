# Client Only

Renders its content only in the browser, after the page has loaded. The server
shows a fallback instead.

```tsx
import { ClientOnly, Skeleton } from '@leverui/components';
```

```tsx
<ClientOnly>
  <SiteThemeToggle />
</ClientOnly>
```

## Direct Children (Use with Caution)

Direct children that use browser APIs may cause errors on the server. Pass a
function to be safe.

```tsx
/* This may cause server-side errors */
<ClientOnly fallback={<Skeleton />}>
  <ComponentThatUsesWindow />
</ClientOnly>

/* This is safe */
<ClientOnly fallback={<Skeleton />}>
  {() => <ComponentThatUsesWindow />}
</ClientOnly>
```

## Props

| Prop       | Default | Type                                 | Description                         |
| ---------- | ------- | ------------------------------------ | ----------------------------------- |
| `fallback` | —       | `JSX.Element`                        | Shown until mounted in the browser. |
| `children` | —       | `JSX.Element \| (() => JSX.Element)` | Shown once mounted.                 |

Adds no wrapper element, accessibility roles, or Lever UI styles. Check that
labels and keyboard focus still work when the content replaces the fallback.
Keep the fallback useful with JavaScript turned off.
