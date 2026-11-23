# Image

An image that fills its box the way you choose, such as cropped to fit or shown
whole.

```tsx
import { Image } from '@leverui/components';
```

```tsx
<Image src="..." />
```

## Guides

### Accessibility

Describe a meaningful image in `alt`. Use `alt=""` for decoration, so screen
readers skip it.

`Image` does not load a fallback image.

### Dimensions

Set the size with `style` or your own class. Set both width and height to crop
to a fixed shape. `fit="contain"` keeps the whole image visible.

`Image` renders a plain `img`, so `width`, `height`, `loading`, and `decoding`
work.

```tsx
<Image
  src="/portrait.jpg"
  alt="Portrait of the speaker"
  style={{ width: '8rem', height: '8rem' }}
  fit="cover"
  class="portrait-image"
/>
```

```css
.portrait-image {
  border-radius: 50%;
}
```

Put `portrait.jpg` in your app's public folder.

## Props

| Prop         | Default | Type                                                                         | Description                                             |
| ------------ | ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| `fit`        | `cover` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` or responsive map | How the image fills its box. CSS `object-fit`.          |
| `align`      | —       | `string` or responsive map                                                   | Where the image sits in its box. CSS `object-position`. |
| `htmlWidth`  | —       | `string \| number`                                                           | `width` attribute on the `img`.                         |
| `htmlHeight` | —       | `string \| number`                                                           | `height` attribute on the `img`.                        |
| `as`         | `img`   | Native HTML tag                                                              | HTML tag to render.                                     |
| `asChild`    | —       | Solid render function                                                        | Render your own element with the image's props.         |
| `unstyled`   | `false` | `boolean`                                                                    | Turn off the default fit and position styles.           |

Also accepts every standard `img` attribute.

## Customize with CSS

Import `@leverui/components/styles.css` once, before your own CSS. Set
`--lui-image-fit` and `--lui-image-position`, or style `.leverui-image`.

No CSS objects or general style props.
