# Locale Provider

Sets the language and text direction for the components inside it, which affects
dates, numbers, and layout.

## Usage

The locale decides how dates, numbers, and other locale-specific data are
formatted.

> Most Lever UI components read the locale from `LocaleProvider`.

```tsx
import { LocaleProvider, useLocaleContext } from '@leverui/components';
```

```tsx
<LocaleProvider locale="...">{/* Your App */}</LocaleProvider>
```

For a right-to-left layout, set `dir` on an element around your content. The
provider adds no styles. Without a provider, the locale is `en-US`. `useFilter`
matches text in the provider's locale.

## Examples

### Setting Locale

```tsx
<LocaleProvider locale="ar-BH">
  <Component />
</LocaleProvider>
```

### Reading Locale

`useLocaleContext` returns a Solid accessor. Call it for the nearest provider's
`locale` and the matching `dir` (text direction).

```tsx
import { useLocaleContext } from '@leverui/components';

export function Usage() {
  const context = useLocaleContext();

  return <pre>{JSON.stringify({ locale: context().locale, dir: context().dir }, null, 2)}</pre>;
}
```

## Props

| Prop       | Default | Type          | Description                     |
| ---------- | ------- | ------------- | ------------------------------- |
| `locale`\* | —       | `string`      | Locale your app uses. Required. |
| `children` | —       | `JSX.Element` | Content that reads the locale.  |
