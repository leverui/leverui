# Link Overlay

Makes a whole card clickable as one link, while links inside it still work on
their own.

```tsx
import { LinkBox, LinkOverlay } from '@leverui/components';
```

```tsx
<LinkBox>
  <LinkOverlay />
</LinkBox>
```

The visible link text is the card's accessible name. Point the link at a real
destination. The overlay does not make the card a button.

Other links inside the `LinkBox` sit above the overlay and stay clickable.

## Caveat

People cannot select the content with a mouse or other pointing device.
