# Toast

A short message that appears in a corner of the screen and goes away on its own,
such as "Saved".

## Setup

Render `<Toaster />` once, near the top of your app. It shows the toasts from
the shared `toaster` store, which you can call from anywhere. For a different
layout or your own store, pass `toaster` and a render function built from the
[Toast parts](#props).

## Usage

```tsx
import { Toaster, toaster } from '@leverui/components';
```

```tsx
<Toaster />
```

```tsx
toaster.create({
  title: 'Toast Title',
  description: 'Toast Description',
});
```

## Maximum Visible Toasts

`max` in `createToaster` limits how many toasts show at once. Extra toasts wait
in a queue until another is dismissed.

```tsx
const toaster = createToaster({
  max: 3,
});
```

## Placement

Any of the four corners of the page. Pick one position and set it in
`createToaster`.

```tsx
const toaster = createToaster({
  placement: 'top-end',
});
```

## Overlapping Toasts

Toasts stack by default. Set `overlap` to `true` to overlap them.

```tsx
const toaster = createToaster({
  placement: 'top-end',
  overlap: true,
});
```

## Page Idle Behavior

`pauseOnPageIdle: true` pauses toast timers while the page is idle or hidden. A
timed toast keeps its remaining time.

```tsx
const toaster = createToaster({
  pauseOnPageIdle: true,
});
```

## Offset

`offsets` moves the toasts away from the screen edges. Pass one value, or one
per edge.

```tsx
const toaster = createToaster({
  offsets: '20px',
});
```

```tsx
const toaster = createToaster({
  offsets: { left: '20px', top: '20px', right: '20px', bottom: '20px' },
});
```

## Guides

### Store operations

`createToaster` returns a toast store. `create` returns an id. Pass it to
`update`, `dismiss`, `pause`, or `resume`.

```ts
const id = toaster.create({ title: 'Uploading', type: 'loading' });
toaster.update(id, { title: 'Uploaded', type: 'success' });
toaster.dismiss(id);
```

Helper methods: `success`, `error`, `info`, `warning`, `loading`, `promise`. A
toast can include an `action` with a label and an `onClick` handler.
`onStatusChange` follows a toast's status.

`Toast.Indicator` shows the default icon for success, warning, and error. For
loading, show a Spinner in your render function. The toast region is labeled
**Notifications** by default and uses `aria-live="polite"`.
